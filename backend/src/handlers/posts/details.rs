use actix_web::{get, web, HttpRequest, HttpResponse};
use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl};
use diesel::dsl::{count_star, exists, select};
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
use crate::models::user::{UserSelect, BaseUser};

#[get("/details/{post_id}")]
async fn post_details(
    db: web::Data<DbService>,
    path: web::Path<String>,
    req: HttpRequest,
) -> HttpResponse {
    let auth_user_id = match get_user_id_from_token(&req).await {
        Ok(id) => Some(id),
        Err(_) => None,
    };

    let mut conn = db.get_conn();
    let pid_str = path.into_inner();

    let pid = match Uuid::parse_str(&pid_str) {
        Ok(uuid) => uuid,
        Err(_) => return HttpResponse::BadRequest().body("Invalid UUID format"),
    };

    // Fetch post and author
    let (post, author) = match posts::posts
        .inner_join(users::users.on(posts::author_id.eq(users::id)))
        .select((PostSchema::as_select(), UserSelect::as_select()))
        .filter(posts::id.eq(pid))
        .first::<(PostSchema, UserSelect)>(&mut conn)
    {
        Ok(data) => data,
        Err(diesel::result::Error::NotFound) => {
            return HttpResponse::NotFound().body("Post not found");
        }
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            return HttpResponse::InternalServerError().body("Internal server error");
        }
    };

    // Media
    let media = post_media::post_media
        .filter(post_media::post_id.eq(post.id))
        .load::<PostMedia>(&mut conn)
        .unwrap_or_default();

    // Likes count
    let likes_count: i64 = post_likes::post_likes
        .filter(post_likes::post_id.eq(post.id))
        .select(count_star())
        .first::<i64>(&mut conn)
        .unwrap_or(0);

    // Is liked
    let is_liked = if let Some(user_id) = auth_user_id {
        select(exists(
            post_likes::post_likes
                .filter(post_likes::post_id.eq(post.id))
                .filter(post_likes::user_id.eq(user_id)),
        ))
        .get_result::<bool>(&mut conn)
        .unwrap_or(false)
    } else {
        false
    };

    // Edit history (last edited_at)
    let edited_at = post_edit_history::post_edit_history
        .filter(post_edit_history::post_id.eq(post.id))
        .select(post_edit_history::edited_at)
        .order_by(post_edit_history::edited_at.desc())
        .first::<DateTime<Utc>>(&mut conn)
        .ok();

    // Determine if current user is author
    let is_author = auth_user_id.map_or(false, |id| id == author.id);

    let response = Post {
        post,
        author: BaseUser { user: author },
        media,
        is_author,
        is_liked,
        likes_count,
        replies_count: 0,
        edited_at,
    };

    HttpResponse::Ok().json(response)
}