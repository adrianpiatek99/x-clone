use actix_web::{post, web, HttpResponse, Responder};
use diesel::{RunQueryDsl, QueryDsl, ExpressionMethods};
use serde_json::json;
use validator::Validate;

use crate::db_service::DbService;
use crate::helpers::token::hash_password;

use crate::schema;

use crate::models::user::NewUser;
use crate::models::auth::RegisterRequest;

#[post("/register")]
async fn register(db: web::Data<DbService>, form: web::Form<RegisterRequest>) -> impl Responder {
    // Validate the form
    if let Err(errors) = form.validate() {
        return HttpResponse::BadRequest().json(json!({
            "error": "Validation failed",
            "details": errors
        }));
    }

    let mut conn = db.get_conn();

    // Check if email already exists
    let email_exists = schema::users::table
        .filter(schema::users::email.eq(&form.email))
        .count()
        .get_result::<i64>(&mut conn)
        .unwrap_or(0) > 0;

    if email_exists {
        return HttpResponse::BadRequest().json(json!({
            "error": "We cannot create account"
        }));
    }

    // Check if screen name already exists
    let screen_name_exists = schema::users::table
        .filter(schema::users::screen_name.eq(&form.screen_name))
        .count()
        .get_result::<i64>(&mut conn)
        .unwrap_or(0) > 0;

    if screen_name_exists {
        return HttpResponse::BadRequest().json(json!({
            "error": "Screen name already taken"
        }));
    }

    let hashed_password = hash_password(form.password.clone());

    let new_user = NewUser {
        name: form.name.clone(),
        screen_name: form.screen_name.clone(),
        email: form.email.clone(),
        password: hashed_password,
        ..NewUser::default()
    };

    match diesel::insert_into(schema::users::table)
        .values(&new_user)
        .execute(&mut conn)
    {
        Ok(_) => HttpResponse::Ok().json(json!({
            "message": "User registered successfully"
        })),
        Err(e) => HttpResponse::InternalServerError().json(json!({
            "error": format!("Failed to register user: {}", e)
        }))
    }
}

