use actix_web::{post, web, HttpResponse, Responder};
use actix_web::cookie::{Cookie, SameSite};
use time::Duration;
use diesel::{RunQueryDsl, QueryDsl, ExpressionMethods};
use diesel::prelude::*;
use serde_json::json;
use validator::Validate;
use std::env;

use crate::db_service::DbService;
use crate::schema;
use crate::models::auth::{generate_token, LoginRequest, hash_password};
use crate::models::auth::LoginResponse;
use crate::models::user::User;

#[post("/login")]
async fn login(db: web::Data<DbService>, form: web::Form<LoginRequest>) -> impl Responder {
    // Validate the form
    if let Err(errors) = form.validate() {
        return HttpResponse::BadRequest().json(json!({
            "error": "Validation failed",
            "details": errors
        }));
    }

    let mut conn = db.get_conn();

    let user_result = schema::users::table
        .filter(schema::users::email.eq(&form.email_or_screen_name))
        .or_filter(schema::users::screen_name.eq(&form.email_or_screen_name))
        .select((User::as_select(), schema::users::password))
        .first::<(User, String)>(&mut conn);

    match user_result {
        Ok((user, stored_password)) => {
            let hashed_password = hash_password(form.password.clone());

            if hashed_password != stored_password {
                return HttpResponse::Unauthorized().json(json!({
                    "error": "Invalid credentials",
                    "details": "Incorrect password"
                }));
            }

            let jwt_secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set in .env file");

            let cookie = Cookie::build("token", generate_token(user.id, &jwt_secret).unwrap())
                .path("/")
                .max_age(Duration::seconds(60 * 60 * 24 * 30))
                .same_site(SameSite::None)
                .http_only(true)
                .finish();

            let response = LoginResponse {
                user,
            };

            HttpResponse::Ok().cookie(cookie).json(response)
        }
        Err(e) => {
            HttpResponse::Unauthorized().json(json!({
                "error": "Invalid credentials",
                "details": e.to_string()
            }))
        }
    }
}
