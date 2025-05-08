use actix_web::{get, web, HttpResponse, HttpRequest};
use actix_web::cookie::{Cookie, SameSite};
use serde::Serialize;
use time::Duration;
use diesel::{QueryDsl, RunQueryDsl, ExpressionMethods};
use diesel::prelude::*;
use serde_json::json;
use ts_rs::TS;
use std::env;

use crate::db_service::DbService;
use crate::helpers::token::{decode_token, is_token_valid, extend_token_expiration, generate_token};

use crate::models::user::{CurrentUser, CurrentUserSelect};
use crate::schema::users::dsl::*;

#[derive(Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/auth.ts")]
pub struct GetCurrentUserResponse {
    #[serde(flatten)]
    pub user: CurrentUser
}


#[get("/currentUser")]
async fn current_user(db: web::Data<DbService>, req: HttpRequest) -> HttpResponse {
    // Check if token cookie exists
    let token = match req.cookie("AUTH_TOKEN") {
        Some(cookie) => cookie.value().to_string(),
        None => return HttpResponse::Unauthorized().json(json!({
            "error": "No authentication token provided"
        })),
    };

    let jwt_secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set in .env file");

    // Decode and validate token
    let mut token_data = match decode_token(&token, &jwt_secret) {
        Ok(data) => data,
        Err(_) => return HttpResponse::Unauthorized().json(json!({
            "error": "Invalid token"
        })),
    };

    if !is_token_valid(&token_data.claims) {
        return HttpResponse::Unauthorized().json(json!({
            "error": "Token expired"
        }));
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
    match users
        .filter(id.eq(token_data.claims.sub))
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

            let response = GetCurrentUserResponse {
                user: current_user,
            };

            HttpResponse::Ok().cookie(cookie).json(response)
        },
        Err(_) => HttpResponse::NotFound().json(json!({
            "error": "User not found"
        })),
    }
}
