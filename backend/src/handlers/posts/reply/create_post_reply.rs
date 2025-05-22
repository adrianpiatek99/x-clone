use actix_multipart::Multipart;
use actix_web::{HttpRequest, HttpResponse, post, web};
use diesel::prelude::*;
use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl};
use futures::{StreamExt, TryStreamExt};
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;
use validator::Validate;

use crate::{
    db_service::DbService,
    handlers::middleware::require_session,
    helpers::validation::validate_post_reply_text,
    models::{
        post::{PostReply, PostReplySelect},
        user::{BaseUser, UserSelect},
    },
    schema::{post_reply::dsl as post_reply, users::dsl as users},
};

#[derive(Deserialize, Validate, TS)]
#[serde(rename_all = "camelCase")]
#[allow(dead_code)]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
pub struct CreatePostReplyRequest {
    #[validate(custom(function = "validate_post_reply_text"))]
    pub text: String,

    #[serde(skip_deserializing)]
    pub post_id: String,
}

#[derive(Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
pub struct CreatePostReplyResponse {
    pub post_reply: PostReply,
}

#[post("/create/reply")]
async fn create_post_reply(
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
    let mut post_id: String = String::new();

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
            "postId" => {
                while let Some(chunk) = field.next().await {
                    post_id = String::from_utf8_lossy(&chunk.unwrap()).to_string();
                }
            }
            _ => {
                // skip unknown fields
                while field.next().await.is_some() {}
            }
        }
    }

    // Validate request
    let form = CreatePostReplyRequest {
        text: text.clone(),
        post_id: post_id.clone(),
    };

    if let Err(errors) = form.validate() {
        return HttpResponse::BadRequest().json(format!("Validation failed: {}", errors));
    }

    // Validate media files count
    // if let Err(e) = validate_files_count(media_files.len(), &FILE_VALIDATION_CONFIGS[2].1) {
    //     return HttpResponse::BadRequest().json(e);
    // }

    // Validate media files
    // for (data, mime) in &media_files {
    //     if let Err(e) = validate_file(data, mime, &FILE_VALIDATION_CONFIGS[2].1) {
    //         return HttpResponse::BadRequest().json(e);
    //     }
    // }

    let mut conn = db.get_conn();

    // Create reply
    let new_reply = PostReplySelect {
        text,
        author_id: session_user_id,
        post_id: Uuid::parse_str(&post_id).unwrap_or_default(),
        ..PostReplySelect::default()
    };

    let reply = match diesel::insert_into(post_reply::post_reply)
        .values(&new_reply)
        .returning(PostReplySelect::as_returning())
        .get_result::<PostReplySelect>(&mut conn)
    {
        Ok(reply) => reply,
        Err(_) => {
            return HttpResponse::InternalServerError().json("Failed to create reply");
        }
    };

    // Upload media files
    // if !media_files.is_empty() {
    //     for (data, mime) in media_files {
    //         match upload_file(&data, &mime).await {
    //             Ok(file) => {
    //                 let new_media = PostMedia {
    //                     url: file.url,
    //                     width: file.width,
    //                     height: file.height,
    //                     post_id: post.id,
    //                     user_id: session_user_id,
    //                     ..PostMedia::default()
    //                 };

    //                 if let Err(_) = diesel::insert_into(post_media::post_media)
    //                     .values(&new_media)
    //                     .execute(&mut conn)
    //                 {
    //                     return HttpResponse::InternalServerError().json("Failed to save media");
    //                 }
    //             }
    //             Err(_) => {
    //                 return HttpResponse::InternalServerError().json("Failed to upload media");
    //             }
    //         }
    //     }
    // }

    // Fetch created reply with author data
    let (post_reply, author) = match post_reply::post_reply
        .inner_join(users::users)
        .select((PostReplySelect::as_select(), UserSelect::as_select()))
        .filter(post_reply::id.eq(reply.id))
        .first::<(PostReplySelect, UserSelect)>(&mut conn)
    {
        Ok(data) => data,
        Err(_) => {
            return HttpResponse::InternalServerError().json("Failed to fetch created reply");
        }
    };

    // Get media
    // let media = post_media::post_media
    //     .filter(post_media::post_id.eq(post.id))
    //     .load::<PostMedia>(&mut conn)
    //     .unwrap_or_default();

    let response = CreatePostReplyResponse {
        post_reply: PostReply {
            post_reply,
            author: BaseUser { user: author },
        },
    };

    HttpResponse::Created().json(response)
}
