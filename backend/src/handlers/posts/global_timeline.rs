use actix_web::{get, web, HttpResponse, Responder};
use diesel::{QueryDsl, RunQueryDsl, ExpressionMethods};
use diesel::prelude::*;
use ::serde::Serialize;

use crate::db_service::DbService;
use crate::schema::posts::dsl::*;
use crate::schema::post_media::dsl::*;
use crate::schema::users::dsl::*;
use crate::models::post::*;
use crate::models::user::User;

#[derive(Serialize)]
pub struct GlobalTimelineResponse {
    #[serde(flatten)]
    pub post: Post,
    pub media: Vec<PostMedia>,
    pub author: User,
}

#[get("/api/posts/test")]
async fn global_timeline(db: web::Data<DbService>) -> impl Responder {
    let mut conn = db.get_conn();

    let posts_list = posts
        .inner_join(users)
        .select((Post::as_select(), User::as_select()))
        .order(crate::schema::posts::dsl::created_at.desc())
        .limit(40)
        .load::<(Post, User)>(&mut conn)
        .expect("Error loading posts");

    let mut posts_with_media = Vec::new();
    for (post, author) in posts_list {
        let media = post_media
            .filter(post_id.eq(post.id))
            .load::<PostMedia>(&mut conn)
            .expect("Error loading media");

        posts_with_media.push(GlobalTimelineResponse {
            post,
            media,
            author,
        });
    }

    HttpResponse::Ok().json(posts_with_media)
}

