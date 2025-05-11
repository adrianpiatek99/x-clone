pub mod create;
pub mod delete;
pub mod details;
pub mod global_timeline;
pub mod like;
pub mod likes;
pub mod track_timeline;
pub mod unlike;
pub mod update;
pub mod user;

use actix_web::web;

pub fn config(cfg: &mut web::ServiceConfig) {
    // let auth = HttpAuthentication::bearer(auth_middleware);

    cfg.service(
        web::scope("/api/posts")
            .service(global_timeline::global_timeline)
            .service(details::post_details)
            .service(create::create_post)
            .service(delete::delete_post)
            .service(update::update_post)
            .service(like::like_post)
            .service(unlike::unlike_post)
            .service(user::posts::user_posts)
            .service(user::media::user_media)
            .service(user::likes::get_user_likes)
            .service(likes::get_post_likes)
            .service(track_timeline::track_timeline),
    );
}
