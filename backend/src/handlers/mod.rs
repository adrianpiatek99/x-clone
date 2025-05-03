pub mod auth;
pub mod posts;

use actix_web::web;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.configure(auth::config)
       .configure(posts::config);
}