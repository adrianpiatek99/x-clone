pub mod details;
pub mod update;

use actix_web::web;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api/users")
    );

    cfg.service(
        web::scope("/api/profile")
            .service(details::profile_details)
            .service(update::update_profile)
    );
}