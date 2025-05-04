use actix_web::{get, web, HttpResponse, Responder, HttpRequest};
use actix_web::cookie::{Cookie, SameSite};
use time::Duration;
use diesel::{QueryDsl, RunQueryDsl, ExpressionMethods};
use diesel::prelude::*;
use serde_json::json;
use std::env;

use crate::db_service::DbService;
use crate::schema::users::dsl::*;
use crate::models::auth::{decode_token, is_token_valid, extend_token_expiration, generate_token};
use crate::models::user::CurrentUser;

#[get("/current-user")]
async fn current_user(db: web::Data<DbService>, req: HttpRequest) -> impl Responder {
    // Check if token cookie exists
    let token = match req.cookie("token") {
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
    let cookie = Cookie::build("token", new_token)
        .path("/")
        .max_age(Duration::seconds(60 * 60 * 24 * 30))
        .same_site(SameSite::None)
        .http_only(true)
        .finish();

    let mut conn = db.get_conn();

    // Get user from database
    match users
        .filter(id.eq(token_data.claims.sub))
        .select(CurrentUser::as_select())
        .first::<CurrentUser>(&mut conn)
    {
        Ok(user) => HttpResponse::Ok().cookie(cookie).json(user),
        Err(_) => HttpResponse::NotFound().json(json!({
            "error": "User not found"
        })),
    }
}
