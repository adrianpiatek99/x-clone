use actix_web::{get, web, HttpRequest, HttpResponse, Responder};
use diesel::{QueryDsl, RunQueryDsl, ExpressionMethods};
use diesel::prelude::*;
use chrono::{DateTime, Utc};
use uuid::Uuid;

use crate::db_service::DbService;
use crate::handlers::middleware::get_user_id_from_token;
use crate::schema::posts::dsl as posts;
use crate::schema::post_media::dsl as post_media;
use crate::schema::users::dsl as users;
use crate::schema::post_likes::dsl as post_likes;
use crate::schema::post_edit_history::dsl as post_edit_history;
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

    let pid = match Uuid::parse_str(&pid_str) {
        Ok(uuid) => uuid,
        Err(_) => return HttpResponse::BadRequest().body("Invalid UUID format"),
    };

    // Get post with author
    let result = posts::posts
        .inner_join(users::users)
        .select((PostSchema::as_select(), User::as_select()))
        .filter(posts::id.eq(pid))
        .first::<(PostSchema, User)>(&mut conn);

    let (post, author) = match result {
        Ok(result) => result,
        Err(diesel::result::Error::NotFound) => {
            return HttpResponse::NotFound().body("Post not found");
        },
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            return HttpResponse::InternalServerError().body("Internal server error");
        }
    };

    // Get media
    let media = post_media::post_media
        .filter(post_media::post_id.eq(post.id))
        .load::<PostMedia>(&mut conn)
        .unwrap_or_default();

    // Get likes count and user's like status in a single query
    let (likes_count, is_liked) = match current_user_id {
        Some(user_id) => {
            let result = post_likes::post_likes
                .filter(post_likes::post_id.eq(post.id))
                .select(post_likes::user_id)
                .load::<Uuid>(&mut conn)
                .unwrap_or_default();

            let likes_count = result.len() as i64;
            let is_liked = result.contains(&user_id);
            (likes_count, is_liked)
        },
        None => {
            let likes_count = post_likes::post_likes
                .filter(post_likes::post_id.eq(post.id))
                .count()
                .get_result::<i64>(&mut conn)
                .unwrap_or(0);
            (likes_count, false)
        }
    };

    // Get edit history
    let edited_at = post_edit_history::post_edit_history
        .filter(post_edit_history::post_id.eq(post.id))
        .select(post_edit_history::edited_at)
        .order_by(post_edit_history::edited_at.desc())
        .first::<DateTime<Utc>>(&mut conn)
        .ok();

    let is_author = current_user_id.map_or(false, |id| id == author.id);

    let response = Post {
        post,
        author,
        media,
        is_author,
        is_liked,
        likes_count,
        replies_count: 0,
        edited_at,
    };

    HttpResponse::Ok().json(response)
}
