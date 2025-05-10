use actix_multipart::Multipart;
use actix_web::{HttpRequest, HttpResponse, patch, web};
use chrono::{DateTime, Utc};
use diesel::prelude::*;
use futures::{StreamExt, TryStreamExt};
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;
use validator::Validate;

use crate::{
    db_service::DbService,
    enums::post_media_type::PostMediaType,
    handlers::middleware::require_session,
    helpers::{
        file::{FILE_VALIDATION_CONFIGS, read_file_data, upload_file, validate_file},
        validation::validate_post_text,
    },
    models::{
        post::{Post, PostMedia, PostSchema},
        user::{BaseUser, UserSelect},
    },
    schema::{
        post_edit_history::dsl as post_edit_history, post_likes::dsl as post_likes,
        post_media::dsl as post_media, posts::dsl as posts, users::dsl as users,
    },
};

#[derive(Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[allow(dead_code)]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
pub struct UpdatePostParams {
    pub id: String,
}

#[derive(Deserialize, Validate, TS)]
#[serde(rename_all = "camelCase")]
#[allow(dead_code)]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
pub struct UpdatePostRequest {
    #[validate(custom(function = "validate_post_text"))]
    pub text: String,

    #[ts(type = "String[] | null")]
    pub removed_media_ids: Option<Vec<String>>,

    #[ts(type = "File[]")]
    pub media: Option<Vec<String>>,
}

#[derive(Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
pub struct UpdatePostResponse {
    #[serde(flatten)]
    pub post: Post,
}

#[derive(AsChangeset)]
#[diesel(table_name = crate::schema::posts)]
struct PostChangeset {
    text: String,
    updated_at: Option<DateTime<Utc>>,
}

#[patch("/update/{post_id}")]
async fn update_post(
    db: web::Data<DbService>,
    req: HttpRequest,
    path: web::Path<String>,
    mut payload: Multipart,
) -> HttpResponse {
    let session_user_id = match require_session(&req).await {
        Some(id) => id,
        None => return HttpResponse::Unauthorized().finish(),
    };

    let path_inner = path.into_inner();

    let path_post_id = match Uuid::parse_str(&path_inner) {
        Ok(uuid) => uuid,
        Err(_e) => return HttpResponse::BadRequest().json("Invalid post ID format"),
    };

    let mut text = String::new();
    let mut media_files = Vec::new();
    let mut removed_media_ids = Vec::new();

    // Read multipart fields
    while let Ok(Some(mut field)) = payload.try_next().await {
        let content_disposition = field.content_disposition().unwrap();
        let field_name = content_disposition.get_name().unwrap_or_default();

        match field_name {
            "text" => {
                while let Some(chunk) = field.next().await {
                    text = String::from_utf8_lossy(&chunk.unwrap()).to_string();
                }
            }
            field_name if field_name.starts_with("media[") => {
                if let Ok((data, mime)) = read_file_data(field).await {
                    media_files.push((data, mime));
                }
            }
            field_name if field_name.starts_with("removedMediaIds[") => {
                while let Some(chunk) = field.next().await {
                    if let Ok(id) = String::from_utf8(chunk.unwrap().to_vec()) {
                        removed_media_ids.push(id);
                    }
                }
            }
            _ => {
                // skip unknown fields
                while field.next().await.is_some() {}
            }
        }
    }

    // Validate request
    let form = UpdatePostRequest {
        text: text.clone(),
        removed_media_ids: Some(removed_media_ids.clone()),
        media: None,
    };

    if let Err(errors) = form.validate() {
        return HttpResponse::BadRequest().json(format!("Validation failed: {}", errors));
    }

    let mut conn = db.get_conn();

    // Check if post exists and get current media
    let post_schema = match posts::posts
        .select(PostSchema::as_select())
        .filter(posts::id.eq(path_post_id))
        .first::<PostSchema>(&mut conn)
    {
        Ok(data) => data,
        Err(_) => return HttpResponse::NotFound().json("Post not found"),
    };

    // Check authorization
    if post_schema.author_id != session_user_id {
        return HttpResponse::Forbidden().json("Unauthorized");
    }

    // Get current media count
    let current_media: Vec<PostMedia> = post_media::post_media
        .filter(post_media::post_id.eq(&post_schema.id))
        .load(&mut conn)
        .unwrap_or_default();

    // Validate media files count
    let remaining_media_count = current_media.len() - removed_media_ids.len();
    let total_media_count = remaining_media_count + media_files.len();

    if total_media_count > FILE_VALIDATION_CONFIGS[2].1.limit as usize {
        return HttpResponse::BadRequest().json(format!(
            "Maximum {} media files allowed per post. You currently have {} files, removing {} and adding {} would exceed the limit.",
            FILE_VALIDATION_CONFIGS[2].1.limit,
            current_media.len(),
            removed_media_ids.len(),
            media_files.len()
        ));
    }

    // Validate media files
    for (data, mime) in &media_files {
        if let Err(e) = validate_file(data, mime, &FILE_VALIDATION_CONFIGS[2].1) {
            return HttpResponse::BadRequest().json(e);
        }
    }

    // Start transaction
    let result = conn.transaction::<_, diesel::result::Error, _>(|conn| {
        // Save edit history
        diesel::insert_into(post_edit_history::post_edit_history)
            .values((
                post_edit_history::id.eq(Uuid::new_v4()),
                post_edit_history::post_id.eq(&post_schema.id),
                post_edit_history::previous_text.eq(&post_schema.text),
                post_edit_history::edited_at.eq(Utc::now()),
            ))
            .execute(conn)?;

        // Update post
        let changeset = PostChangeset {
            text: text.clone(),
            updated_at: Some(Utc::now()),
        };

        diesel::update(posts::posts.filter(posts::id.eq(&post_schema.id)))
            .set(changeset)
            .execute(conn)?;

        // Delete removed media
        if !removed_media_ids.is_empty() {
            let removed_ids: Vec<Uuid> = removed_media_ids
                .iter()
                .filter_map(|id| Uuid::parse_str(id).ok())
                .collect();

            diesel::delete(post_media::post_media.filter(post_media::id.eq_any(&removed_ids)))
                .execute(conn)?;
        }

        Ok(())
    });

    match result {
        Ok(_) => {
            // Upload and add new media files
            if !media_files.is_empty() {
                for (data, mime) in media_files {
                    match upload_file(&data, &mime).await {
                        Ok(file) => {
                            if let Err(e) = diesel::insert_into(post_media::post_media)
                                .values((
                                    post_media::id.eq(Uuid::new_v4()),
                                    post_media::url.eq(file.url),
                                    post_media::width.eq(file.width),
                                    post_media::height.eq(file.height),
                                    post_media::type_.eq(PostMediaType::Photo),
                                    post_media::post_id.eq(&post_schema.id),
                                    post_media::user_id.eq(session_user_id),
                                    post_media::created_at.eq(Utc::now()),
                                ))
                                .execute(&mut conn)
                            {
                                return HttpResponse::InternalServerError()
                                    .json(format!("Failed to save media: {}", e));
                            }
                        }
                        Err(e) => {
                            return HttpResponse::InternalServerError()
                                .json(format!("Failed to upload media: {}", e));
                        }
                    }
                }
            }

            // Fetch updated post with all related data
            let (updated_post_schema, author) = posts::posts
                .inner_join(users::users)
                .select((PostSchema::as_select(), UserSelect::as_select()))
                .filter(posts::id.eq(&post_schema.id))
                .first::<(PostSchema, UserSelect)>(&mut conn)
                .unwrap();

            let media = post_media::post_media
                .filter(post_media::post_id.eq(&updated_post_schema.id))
                .load::<PostMedia>(&mut conn)
                .unwrap();

            let likes_count = post_likes::post_likes
                .filter(post_likes::post_id.eq(&updated_post_schema.id))
                .count()
                .get_result::<i64>(&mut conn)
                .unwrap_or(0);

            let is_liked = post_likes::post_likes
                .filter(post_likes::post_id.eq(&updated_post_schema.id))
                .filter(post_likes::user_id.eq(&session_user_id))
                .count()
                .get_result::<i64>(&mut conn)
                .unwrap_or(0)
                > 0;

            let edited_at = post_edit_history::post_edit_history
                .filter(post_edit_history::post_id.eq(&updated_post_schema.id))
                .order_by(post_edit_history::edited_at.desc())
                .select(post_edit_history::edited_at)
                .first::<DateTime<Utc>>(&mut conn)
                .ok();

            let response = UpdatePostResponse {
                post: Post {
                    post: updated_post_schema,
                    author: BaseUser { user: author },
                    media,
                    is_author: true,
                    is_liked,
                    likes_count,
                    replies_count: 0, // TODO: Implement replies count
                    edited_at,
                },
            };

            HttpResponse::Ok().json(response)
        }
        Err(e) => HttpResponse::InternalServerError().json(format!("Failed to update post: {}", e)),
    }
}
