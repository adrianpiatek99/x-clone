use actix_web::cookie::{Cookie, SameSite};
use actix_web::{HttpResponse, post};
use time::Duration;

#[post("/logout")]
async fn logout() -> HttpResponse {
    // Create an expired cookie to clear the AUTH_TOKEN
    let cookie = Cookie::build("AUTH_TOKEN", "")
        .path("/")
        .max_age(Duration::seconds(0))
        .same_site(SameSite::None)
        .http_only(true)
        .finish();

    HttpResponse::Ok().cookie(cookie).finish()
}
