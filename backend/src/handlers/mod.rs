pub mod auth;
pub mod posts;
pub mod users;
pub mod middleware;

use actix_web::web;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.configure(auth::config)
       .configure(posts::config)
       .configure(users::config);
}