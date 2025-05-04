use actix_web::{get, web, HttpResponse, Responder, HttpRequest};
use diesel::{QueryDsl, RunQueryDsl, ExpressionMethods};
use diesel::prelude::*;

use crate::db_service::DbService;
use crate::schema::posts::dsl as posts;
use crate::schema::post_media::dsl as post_media;
use crate::schema::users::dsl as users;
use crate::models::post::*;
use crate::models::user::User;
use crate::handlers::middleware::get_user_id_from_token;

#[get("/posts/test")]
async fn global_timeline(db: web::Data<DbService>, req: HttpRequest) -> impl Responder {
    let current_user_id = match get_user_id_from_token(&req).await {
        Ok(id) => Some(id),
        Err(_) => None,
    };
    let mut conn = db.get_conn();

    let posts_list = posts::posts
        .inner_join(users::users)
        .select((PostSchema::as_select(), User::as_select()))
        .order(crate::schema::posts::dsl::created_at.desc())
        .limit(40)
        .load::<(PostSchema, User)>(&mut conn)
        .expect("Error loading posts");

    let mut response = Vec::new();

    for (post, author) in posts_list {
        let media = post_media::post_media
            .filter(post_media::post_id.eq(post.id))
            .load::<PostMedia>(&mut conn)
            .expect("Error loading media");

        let is_liked = false;

        response.push(Post {
            post,
            media,
            author: author.clone(),
            is_author: current_user_id.map_or(false, |id| id == author.id),
            is_liked,
            likes_count: 0,
            replies_count: 0,
            edited_at: None,
        });
    }

    HttpResponse::Ok().json(response)
}

