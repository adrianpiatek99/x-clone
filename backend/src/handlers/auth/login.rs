use actix_web::{post, web, HttpResponse};
use actix_web::cookie::{Cookie, SameSite};
use serde::{Deserialize, Serialize};
use time::Duration;
use diesel::{RunQueryDsl, QueryDsl, ExpressionMethods};
use serde_json::json;
use ts_rs::TS;
use validator::Validate;
use diesel::prelude::*;
use std::env;

use crate::db_service::DbService;
use crate::helpers::token::{generate_token, hash_password};
use crate::helpers::validation::validate_password;

use crate::schema;

use crate::models::user::{CurrentUser, CurrentUserSelect};

#[derive(Deserialize, Validate, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/auth.ts")]
pub struct LoginRequest {
  #[validate(length(max = 100, message = "Email or screen name must be less than 100 characters"))]
  pub email_or_screen_name: String,
  #[validate(custom(function = "validate_password"))]
  pub password: String,
}

#[derive(Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/auth.ts")]
pub struct LoginResponse {
    #[serde(flatten)]
    pub user: CurrentUser
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

    let user_result = schema::users::table
        .filter(schema::users::email.eq(&form.email_or_screen_name))
        .or_filter(schema::users::screen_name.eq(&form.email_or_screen_name))
        .select((CurrentUserSelect::as_select(), schema::users::password))
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

            let response = LoginResponse {
                user: current_user,
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
