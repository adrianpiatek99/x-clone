use actix_web::{get, web, HttpRequest, HttpResponse};
use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl};
// use diesel::dsl::count_star;
use diesel::prelude::*;
use serde::Serialize;
use ts_rs::TS;

use crate::db_service::DbService;
use crate::handlers::middleware::get_user_id_from_token;

use crate::schema::users::dsl as users;
// use crate::schema::posts::dsl as posts;

use crate::models::user::{PublicUser, UserSelect};

#[derive(Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/user.ts")]
pub struct ProfileDetailsResponse {
    #[serde(flatten)]
    pub user: PublicUser
}


#[get("/details/{screen_name}")]
async fn profile_details(
    db: web::Data<DbService>,
    path: web::Path<String>,
    req: HttpRequest,
) -> HttpResponse {
    let auth_user_id = match get_user_id_from_token(&req).await {
        Ok(id) => Some(id),
        Err(_) => None,
    };

    let mut conn = db.get_conn();
    let screen_name = path.into_inner();

    // Fetch user
    let user = match users::users
        .filter(users::screen_name.eq(&screen_name))
        .select(UserSelect::as_select())
        .first::<UserSelect>(&mut conn)
    {
        Ok(user) => user,
        Err(diesel::result::Error::NotFound) => {
            return HttpResponse::NotFound().body("User not found");
        }
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            return HttpResponse::InternalServerError().body("Internal server error");
        }
    };

    // Get followers count
    // let followers_count: i64 = follows::follows
    //     .filter(follows::followed_id.eq(user.id))
    //     .select(count_star())
    //     .first::<i64>(&mut conn)
    //     .unwrap_or(0);

    // Get following count
    // let following_count: i64 = follows::follows
    //     .filter(follows::follower_id.eq(user.id))
    //     .select(count_star())
    //     .first::<i64>(&mut conn)
    //     .unwrap_or(0);

    // Check if current user is following this user
    // let is_following = if let Some(user_id) = current_user_id {
    //     follows::follows
    //         .filter(follows::follower_id.eq(user_id))
    //         .filter(follows::followed_id.eq(user.id))
    //         .select(count_star())
    //         .first::<i64>(&mut conn)
    //         .unwrap_or(0) > 0
    // } else {
    //     false
    // };

    let public_user = PublicUser {
        user,
        is_following: false,
        followers_count: 0,
        following_count: 0,
    };

    let response = ProfileDetailsResponse {
        user: public_user,
    };


    HttpResponse::Ok().json(response)
}

