use actix_web::{HttpRequest, HttpResponse, post, web};
use diesel::{prelude::*, result::Error::NotFound};
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

use crate::{
    db_service::DbService, handlers::middleware::require_session, models::user::Follow,
    schema::follows::dsl as follows,
};

#[derive(Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/user.ts")]
#[allow(dead_code)]
pub struct FollowUserParams {
    pub user_id: String,
}

#[derive(Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/user.ts")]
pub struct FollowUserResponse {
    pub id: Uuid,
    pub message: String,
}

#[post("/follow/{user_id}")]
async fn follow_user(
    db: web::Data<DbService>,
    req: HttpRequest,
    path: web::Path<String>,
) -> HttpResponse {
    let session_user_id = match require_session(&req).await {
        Some(id) => id,
        None => return HttpResponse::Unauthorized().finish(),
    };
    let path_user_id = path.into_inner();

    let user_id = match uuid::Uuid::parse_str(&path_user_id) {
        Ok(uuid) => uuid,
        Err(_) => return HttpResponse::BadRequest().body("Invalid UUID format"),
    };

    let mut conn = db.get_conn();

    let existing_follow = follows::follows
        .filter(follows::follower_id.eq(session_user_id))
        .filter(follows::following_id.eq(user_id))
        .first::<Follow>(&mut conn);

    match existing_follow {
        Ok(_) => HttpResponse::BadRequest().json("You have already followed this user"),
        Err(NotFound) => {
            let new_follow = Follow {
                follower_id: session_user_id,
                following_id: user_id,
                ..Follow::default()
            };

            match diesel::insert_into(follows::follows)
                .values(&new_follow)
                .execute(&mut conn)
            {
                Ok(_) => HttpResponse::Ok().json(FollowUserResponse {
                    id: new_follow.id,
                    message: "You are now following this user".to_string(),
                }),
                Err(_) => HttpResponse::InternalServerError().body("Failed to follow user"),
            }
        }
        Err(_) => {
            HttpResponse::InternalServerError().body("Failed to check if user was already followed")
        }
    }
}
