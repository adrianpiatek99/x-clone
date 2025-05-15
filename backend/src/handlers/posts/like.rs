use actix_web::{HttpRequest, HttpResponse, post, web};
use diesel::{prelude::*, result::Error::NotFound};
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

use crate::{
    db_service::DbService, handlers::middleware::require_session, models::post::PostLikeSchema,
    schema::post_likes::dsl as post_likes,
};

#[derive(Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
#[allow(dead_code)]
pub struct LikePostParams {
    pub post_id: String,
}

#[derive(Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
pub struct LikePostResponse {
    pub id: Uuid,
    pub message: String,
}

#[post("/like/{post_id}")]
async fn like_post(
    db: web::Data<DbService>,
    req: HttpRequest,
    path: web::Path<String>,
) -> HttpResponse {
    let session_user_id = match require_session(&req).await {
        Some(id) => id,
        None => return HttpResponse::Unauthorized().finish(),
    };
    let path_post_id = path.into_inner();

    let post_id = match uuid::Uuid::parse_str(&path_post_id) {
        Ok(uuid) => uuid,
        Err(_) => return HttpResponse::BadRequest().body("Invalid UUID format"),
    };

    let mut conn = db.get_conn();

    // Check if user already liked this post
    let existing_like = post_likes::post_likes
        .filter(post_likes::post_id.eq(post_id))
        .filter(post_likes::user_id.eq(session_user_id))
        .first::<PostLikeSchema>(&mut conn);

    match existing_like {
        Ok(_) => HttpResponse::BadRequest().json(LikePostResponse {
            id: post_id,
            message: "You have already liked this post".to_string(),
        }),
        Err(NotFound) => {
            // User hasn't liked this post yet, proceed with inserting new like

            let new_like: PostLikeSchema = PostLikeSchema {
                post_id,
                user_id: session_user_id,
                ..PostLikeSchema::default()
            };

            let insert_result = diesel::insert_into(post_likes::post_likes)
                .values(&new_like)
                .execute(&mut conn);

            match insert_result {
                Ok(_) => HttpResponse::Ok().json(LikePostResponse {
                    id: post_id,
                    message: "Post liked successfully".to_string(),
                }),
                Err(_) => HttpResponse::InternalServerError().body("Failed to like post"),
            }
        }
        Err(_) => {
            HttpResponse::InternalServerError().body("Failed to check if post was already liked")
        }
    }
}
