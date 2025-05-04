use actix_web::{get, web, HttpRequest, HttpResponse, Responder};
use diesel::{QueryDsl, RunQueryDsl, ExpressionMethods};
use diesel::prelude::*;

use crate::db_service::DbService;
use crate::handlers::middleware::get_user_id_from_token;
use crate::schema::posts::dsl as posts;
use crate::schema::post_media::dsl as post_media;
use crate::schema::users::dsl as users;
use crate::schema::post_likes::dsl as post_likes;
use crate::models::post::*;
use crate::models::user::*;

#[get("/posts/{post_id}")]
async fn post_details(db: web::Data<DbService>, path: web::Path<String>, req: HttpRequest) -> impl Responder {
    let current_user_id = match get_user_id_from_token(&req).await {
        Ok(id) => Some(id),
        Err(_) => None,
    };
    let mut conn = db.get_conn();
    let pid_str = path.into_inner();

    let pid = match uuid::Uuid::parse_str(&pid_str) {
        Ok(uuid) => uuid,
        Err(_) => return HttpResponse::BadRequest().body("Invalid UUID format"),
    };

    // Get post with author
    let result = posts::posts
        .inner_join(users::users)
        .select((PostSchema::as_select(), User::as_select()))
        .filter(posts::id.eq(pid))
        .first::<(PostSchema, User)>(&mut conn);

    match result {
        Ok((post, author)) => {
            // Get all media for this post
            let media = post_media::post_media
                .filter(post_media::post_id.eq(post.id))
                .load::<PostMedia>(&mut conn)
                .expect("Error loading media");

            // Get likes count in one query
            let likes_count = post_likes::post_likes
                .filter(post_likes::post_id.eq(post.id))
                .count()
                .get_result::<i64>(&mut conn)
                .unwrap_or(0);

            // Get user's like status in one query if user is logged in
            let is_liked = if let Some(user_id) = current_user_id {
                post_likes::post_likes
                    .filter(post_likes::post_id.eq(post.id))
                    .filter(post_likes::user_id.eq(user_id))
                    .select(post_likes::id)
                    .first::<uuid::Uuid>(&mut conn)
                    .is_ok()
            } else {
                false
            };

            let is_author = current_user_id.map_or(false, |id| id == author.id);

            let response = Post {
                post,
                author,
                media,
                is_author,
                is_liked,
                likes_count,
                replies_count: 0,
                edited_at: None,
            };

            HttpResponse::Ok().json(response)
        },
        Err(diesel::result::Error::NotFound) => HttpResponse::NotFound().body("Post not found"),
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            HttpResponse::InternalServerError().body("Internal server error")
        }
    }
}
