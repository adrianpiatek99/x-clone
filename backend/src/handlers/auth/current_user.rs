use actix_web::cookie::{Cookie, SameSite};
use actix_web::{HttpRequest, HttpResponse, get, web};
use diesel::prelude::*;
use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl};
use serde::Serialize;
use std::env;
use time::Duration;
use ts_rs::TS;

use crate::{
    db_service::DbService,
    helpers::token::{decode_token, extend_token_expiration, generate_token, is_token_valid},
    models::user::{CurrentUser, CurrentUserSelect},
    schema::users::dsl as users,
};

#[derive(Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/auth.ts")]
pub struct GetCurrentUserResponse {
    #[serde(flatten)]
    pub user: CurrentUser,
}

#[get("/currentUser")]
async fn current_user(db: web::Data<DbService>, req: HttpRequest) -> HttpResponse {
    // Check if token cookie exists
    let token = match req.cookie("AUTH_TOKEN") {
        Some(cookie) => cookie.value().to_string(),
        None => {
            return HttpResponse::Unauthorized().json("No authentication token provided");
        }
    };

    let jwt_secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set in .env file");

    // Decode and validate token
    let mut token_data = match decode_token(&token, &jwt_secret) {
        Ok(data) => data,
        Err(_) => {
            return HttpResponse::Unauthorized().json("Invalid token");
        }
    };

    if !is_token_valid(&token_data.claims) {
        return HttpResponse::Unauthorized().json("Token expired");
    }

    // Extend token expiration time
    extend_token_expiration(&mut token_data.claims);
    let new_token = generate_token(token_data.claims.sub, &jwt_secret).unwrap();
    let cookie = Cookie::build("AUTH_TOKEN", new_token)
        .path("/")
        .max_age(Duration::seconds(60 * 60 * 24 * 30))
        .same_site(SameSite::None)
        .http_only(true)
        .finish();

    let mut conn = db.get_conn();

    // Get user from database
    match users::users
        .filter(users::id.eq(token_data.claims.sub))
        .select(CurrentUserSelect::as_select())
        .first::<CurrentUserSelect>(&mut conn)
    {
        Ok(user) => {
            let current_user = CurrentUser {
                user,
                is_following: false,
                followers_count: 0,
                following_count: 0,
            };

            let response = GetCurrentUserResponse { user: current_user };

            HttpResponse::Ok().cookie(cookie).json(response)
        }
        Err(_) => HttpResponse::NotFound().json("User not found"),
    }
}
