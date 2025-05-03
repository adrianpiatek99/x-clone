pub mod register;
pub mod login;

use actix_web::web;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(register::register);
}