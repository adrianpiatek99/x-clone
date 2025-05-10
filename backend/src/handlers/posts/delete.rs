use actix_web::{HttpRequest, HttpResponse, delete, web};
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

use crate::{
    db_service::DbService, handlers::middleware::require_session, models::post::PostSchema,
    schema::posts::dsl as posts,
};

#[derive(Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[allow(dead_code)]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
pub struct DeletePostParams {
    pub id: String,
}

#[derive(Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[allow(dead_code)]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
pub struct DeletePostResponse {
    pub id: Uuid,
    pub message: String,
}

#[delete("/delete/{post_id}")]
async fn delete_post(
    db: web::Data<DbService>,
    req: HttpRequest,
    path: web::Path<String>,
) -> HttpResponse {
    let session_user_id = match require_session(&req).await {
        Some(id) => id,
        None => return HttpResponse::Unauthorized().finish(),
    };

    let path_inner = path.into_inner();

    let path_post_id = match Uuid::parse_str(&path_inner) {
        Ok(uuid) => uuid,
        Err(e) => return HttpResponse::BadRequest().json("Invalid post ID format"),
    };

    let mut conn = db.get_conn();

    // First check if post exists and belongs to the user
    let post = match posts::posts
        .filter(posts::id.eq(path_post_id))
        .first::<PostSchema>(&mut conn)
    {
        Ok(post) => post,
        Err(_) => {
            return HttpResponse::NotFound().json("Post not found");
        }
    };

    if post.author_id != session_user_id {
        return HttpResponse::Forbidden().json("Unauthorized");
    }

    // Delete the post
    match diesel::delete(posts::posts.filter(posts::id.eq(post.id))).execute(&mut conn) {
        Ok(_) => {
            let response = DeletePostResponse {
                id: post.id,
                message: String::from("Post deleted"),
            };

            HttpResponse::Ok().json(response)
        }
        Err(_) => HttpResponse::InternalServerError().json("Failed to delete post"),
    }
}
