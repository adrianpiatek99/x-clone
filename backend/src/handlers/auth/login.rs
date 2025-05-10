use actix_web::cookie::{Cookie, SameSite};
use actix_web::{HttpResponse, post, web};
use diesel::prelude::*;
use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl};
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::env;
use time::Duration;
use ts_rs::TS;
use validator::Validate;

use crate::{
    db_service::DbService,
    helpers::{
        token::{generate_token, hash_password},
        validation::validate_password,
    },
    models::user::{CurrentUser, CurrentUserSelect},
    schema::users::dsl as users,
};

#[derive(Deserialize, Validate, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/auth.ts")]
pub struct LoginRequest {
    #[validate(length(
        max = 100,
        message = "Email or screen name must be less than 100 characters"
    ))]
    pub email_or_screen_name: String,
    #[validate(custom(function = "validate_password"))]
    pub password: String,
}

#[derive(Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/auth.ts")]
pub struct LoginResponse {
    #[serde(flatten)]
    pub user: CurrentUser,
}

#[post("/login")]
async fn login(db: web::Data<DbService>, form: web::Json<LoginRequest>) -> HttpResponse {
    // Validate the form
    if let Err(errors) = form.validate() {
        return HttpResponse::BadRequest().json(json!({
            "error": "Validation failed",
            "details": errors
        }));
    }

    let mut conn = db.get_conn();

    let user_result = users::users
        .filter(users::email.eq(&form.email_or_screen_name))
        .or_filter(users::screen_name.eq(&form.email_or_screen_name))
        .select((CurrentUserSelect::as_select(), users::password))
        .first::<(CurrentUserSelect, String)>(&mut conn);

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

            let cookie = Cookie::build("AUTH_TOKEN", generate_token(user.id, &jwt_secret).unwrap())
                .path("/")
                .max_age(Duration::seconds(60 * 60 * 24 * 30))
                .same_site(SameSite::None)
                .http_only(true)
                .finish();

            let current_user = CurrentUser {
                user,
                is_following: false,
                followers_count: 0,
                following_count: 0,
            };

            let response = LoginResponse { user: current_user };

            HttpResponse::Ok().cookie(cookie).json(response)
        }
        Err(e) => HttpResponse::Unauthorized().json(json!({
            "error": "Invalid credentials",
            "details": e.to_string()
        })),
    }
}
