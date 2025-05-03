pub mod global_timeline;
pub mod post_details;

use actix_web::web;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(global_timeline::global_timeline)
       .service(post_details::post_details);
}