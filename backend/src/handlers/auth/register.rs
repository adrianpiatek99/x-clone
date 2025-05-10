use actix_web::{HttpResponse, Responder, post, web};
use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl};
use serde::Deserialize;
use ts_rs::TS;
use validator::Validate;

use crate::{
    db_service::DbService,
    helpers::{
        token::hash_password,
        validation::{validate_email, validate_name, validate_password, validate_screen_name},
    },
    models::user::NewUser,
    schema::users::dsl as users,
};

#[derive(Deserialize, Validate, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/auth.ts")]
pub struct RegisterRequest {
    #[validate(custom(function = "validate_name"))]
    pub name: String,

    #[validate(custom(function = "validate_screen_name"))]
    pub screen_name: String,

    #[validate(
        email(message = "Invalid email format"),
        custom(function = "validate_email")
    )]
    pub email: String,

    #[validate(custom(function = "validate_password"))]
    pub password: String,
}

#[post("/register")]
async fn register(db: web::Data<DbService>, form: web::Json<RegisterRequest>) -> impl Responder {
    // Validate the form
    if let Err(errors) = form.validate() {
        return HttpResponse::BadRequest().json(format!("Validation failed: {}", errors));
    }

    let mut conn = db.get_conn();

    // Check if email already exists
    let email_exists = users::users
        .filter(users::email.eq(&form.email))
        .count()
        .get_result::<i64>(&mut conn)
        .unwrap_or(0)
        > 0;

    if email_exists {
        return HttpResponse::BadRequest().json("We cannot create account");
    }

    // Check if screen name already exists
    let screen_name_exists = users::users
        .filter(users::screen_name.eq(&form.screen_name))
        .count()
        .get_result::<i64>(&mut conn)
        .unwrap_or(0)
        > 0;

    if screen_name_exists {
        return HttpResponse::BadRequest().json("Screen name already taken");
    }

    let hashed_password = hash_password(form.password.clone());

    let new_user = NewUser {
        name: form.name.clone(),
        screen_name: form.screen_name.clone(),
        email: form.email.clone(),
        password: hashed_password,
        ..NewUser::default()
    };

    match diesel::insert_into(users::users)
        .values(&new_user)
        .execute(&mut conn)
    {
        Ok(_) => HttpResponse::Ok().json("User registered successfully"),
        Err(e) => {
            HttpResponse::InternalServerError().json(format!("Failed to register user: {}", e))
        }
    }
}
