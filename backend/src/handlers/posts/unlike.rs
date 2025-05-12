use actix_web::{HttpRequest, HttpResponse, delete, web};
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
pub struct UnlikePostParams {
    pub post_id: String,
}

#[derive(Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
pub struct UnlikePostResponse {
    pub id: Uuid,
    pub message: String,
}

#[delete("/unlike/{post_id}")]
async fn unlike_post(
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

    // Check if user has liked this post
    let existing_like = post_likes::post_likes
        .filter(post_likes::post_id.eq(post_id))
        .filter(post_likes::user_id.eq(session_user_id))
        .first::<PostLikeSchema>(&mut conn);

    match existing_like {
        Ok(_) => {
            // User has liked this post, proceed with removing the like
            let delete_result = diesel::delete(
                post_likes::post_likes
                    .filter(post_likes::post_id.eq(post_id))
                    .filter(post_likes::user_id.eq(session_user_id)),
            )
            .execute(&mut conn);

            match delete_result {
                Ok(_) => HttpResponse::Ok().json(UnlikePostResponse {
                    id: post_id,
                    message: "Post unliked successfully".to_string(),
                }),
                Err(_) => HttpResponse::InternalServerError().body("Failed to unlike post"),
            }
        }
        Err(NotFound) => HttpResponse::BadRequest().body("You haven't liked this post yet"),
        Err(_) => HttpResponse::InternalServerError().body("Failed to check if post was liked"),
    }
}
