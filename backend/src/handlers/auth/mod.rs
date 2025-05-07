pub mod register;
pub mod login;
pub mod auth_user;

use actix_web::web;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api/auth")
        .service(register::register)
        .service(login::login)
        .service(auth_user::auth_user)
    );
}