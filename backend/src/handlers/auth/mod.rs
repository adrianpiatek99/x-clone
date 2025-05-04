pub mod register;
pub mod login;
pub mod current_user;

use actix_web::web;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(register::register)
       .service(login::login)
       .service(current_user::current_user);
}