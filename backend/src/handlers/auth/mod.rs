pub mod current_user;
pub mod login;
pub mod logout;
pub mod register;

use actix_web::web;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api/auth")
            .service(register::register)
            .service(login::login)
            .service(current_user::current_user)
            .service(logout::logout),
    );
}
