pub mod details;
pub mod follow;
pub mod get_followers;
pub mod get_following;
pub mod unfollow;
pub mod update;

use actix_web::web;

pub fn config(cfg: &mut web::ServiceConfig) {
    // let auth = HttpAuthentication::bearer(auth_middleware);

    cfg.service(
        web::scope("/api/users")
            .service(follow::follow_user)
            .service(unfollow::unfollow_user)
            .service(get_following::get_following)
            .service(get_followers::get_followers),
    );

    cfg.service(
        web::scope("/api/profile")
            .service(details::profile_details)
            .service(update::update_profile),
    );
}
