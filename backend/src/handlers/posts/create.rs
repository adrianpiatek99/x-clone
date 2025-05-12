use actix_multipart::Multipart;
use actix_web::{HttpRequest, HttpResponse, post, web};
use chrono::Utc;
use diesel::prelude::*;
use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl};
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
        file::{
            FILE_VALIDATION_CONFIGS, read_file_data, upload_file, validate_file,
            validate_files_count,
        },
        validation::validate_post_text,
    },
    models::{
        post::{Post, PostMedia, PostSchema},
        user::{BaseUser, UserSelect},
    },
    schema::{post_media::dsl as post_media, posts::dsl as posts, users::dsl as users},
};

#[derive(Deserialize, Validate, TS)]
#[serde(rename_all = "camelCase")]
#[allow(dead_code)]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
pub struct CreatePostRequest {
    #[validate(custom(function = "validate_post_text"))]
    pub text: String,

    #[ts(type = "File[]")]
    pub media: Option<Vec<String>>,
}

#[derive(Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
pub struct CreatePostResponse {
    #[serde(flatten)]
    pub post: Post,
}

#[post("/create")]
async fn create_post(
    db: web::Data<DbService>,
    req: HttpRequest,
    mut payload: Multipart,
) -> HttpResponse {
    let session_user_id = match require_session(&req).await {
        Some(id) => id,
        None => return HttpResponse::Unauthorized().finish(),
    };

    // Form fields
    let mut text: String = String::new();
    let mut media_files = Vec::new();

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
            _ => {
                // skip unknown fields
                while field.next().await.is_some() {}
            }
        }
    }

    // Validate request
    let form = CreatePostRequest {
        text: text.clone(),
        media: None,
    };

    if let Err(errors) = form.validate() {
        return HttpResponse::BadRequest().json(format!("Validation failed: {}", errors));
    }

    // Validate media files count
    if let Err(e) = validate_files_count(media_files.len(), &FILE_VALIDATION_CONFIGS[2].1) {
        return HttpResponse::BadRequest().json(e);
    }

    // Validate media files
    for (data, mime) in &media_files {
        if let Err(e) = validate_file(data, mime, &FILE_VALIDATION_CONFIGS[2].1) {
            return HttpResponse::BadRequest().json(e);
        }
    }

    let mut conn = db.get_conn();

    // Create post
    let post = match diesel::insert_into(posts::posts)
        .values((
            posts::id.eq(Uuid::new_v4()),
            posts::text.eq(text),
            posts::author_id.eq(session_user_id),
            posts::hashtags.eq(None::<Vec<Option<String>>>),
            posts::created_at.eq(Utc::now()),
            posts::updated_at.eq(Utc::now()),
        ))
        .returning(PostSchema::as_returning())
        .get_result::<PostSchema>(&mut conn)
    {
        Ok(post) => post,
        Err(_) => {
            return HttpResponse::InternalServerError().json("Failed to create post");
        }
    };

    // Upload media files
    if !media_files.is_empty() {
        for (data, mime) in media_files {
            match upload_file(&data, &mime).await {
                Ok(file) => {
                    if let Err(_) = diesel::insert_into(post_media::post_media)
                        .values((
                            post_media::id.eq(Uuid::new_v4()),
                            post_media::url.eq(file.url),
                            post_media::width.eq(file.width),
                            post_media::height.eq(file.height),
                            post_media::type_.eq(PostMediaType::Photo),
                            post_media::post_id.eq(post.id),
                            post_media::user_id.eq(session_user_id),
                            post_media::created_at.eq(Utc::now()),
                        ))
                        .execute(&mut conn)
                    {
                        return HttpResponse::InternalServerError().json("Failed to save media");
                    }
                }
                Err(e) => {
                    return HttpResponse::InternalServerError().json("Failed to upload media");
                }
            }
        }
    }

    // Fetch created post with all related data
    let (post, author) = match posts::posts
        .inner_join(users::users)
        .select((PostSchema::as_select(), UserSelect::as_select()))
        .filter(posts::id.eq(post.id))
        .first::<(PostSchema, UserSelect)>(&mut conn)
    {
        Ok(data) => data,
        Err(_) => {
            return HttpResponse::InternalServerError().json("Failed to fetch created post");
        }
    };

    // Get media
    let media = post_media::post_media
        .filter(post_media::post_id.eq(post.id))
        .load::<PostMedia>(&mut conn)
        .unwrap_or_default();

    let response = CreatePostResponse {
        post: Post {
            post,
            author: BaseUser { user: author },
            media,
            is_author: true,
            is_liked: false,
            likes_count: 0,
            replies_count: 0,
            edited_at: None,
        },
    };

    HttpResponse::Created().json(response)
}
