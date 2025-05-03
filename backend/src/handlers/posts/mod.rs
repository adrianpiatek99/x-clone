pub mod global_timeline;
pub mod delete;
pub mod details;
pub mod create;
pub mod track_timeline;
pub mod like;
pub mod unlike;
pub mod update;
pub mod likes;

pub mod user;

use actix_web::web;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(global_timeline::global_timeline)
       .service(details::post_details);
}