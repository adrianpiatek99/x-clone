use actix_web::{get, web, HttpResponse, Responder, HttpRequest};
use diesel::{QueryDsl, RunQueryDsl, ExpressionMethods};
use diesel::prelude::*;
use diesel::dsl::count;
use chrono::{DateTime, Utc};
use uuid::Uuid;

use crate::db_service::DbService;
use crate::schema::posts::dsl as posts;
use crate::schema::post_media::dsl as post_media;
use crate::schema::users::dsl as users;
use crate::schema::post_likes::dsl as post_likes;
use crate::schema::post_edit_history::dsl as post_edit_history;
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

    // Get all posts with authors
    let posts_list = posts::posts
        .inner_join(users::users)
        .select((PostSchema::as_select(), User::as_select()))
        .order(posts::created_at.desc())
        .limit(40)
        .load::<(PostSchema, User)>(&mut conn)
        .expect("Error loading posts");

    let post_ids: Vec<Uuid> = posts_list.iter().map(|(post, _)| post.id).collect();

    // Get all media for these posts
    let media_list = post_media::post_media
        .filter(post_media::post_id.eq_any(&post_ids))
        .load::<PostMedia>(&mut conn)
        .expect("Error loading media");

    // Group media by post_id
    let mut media_by_post: std::collections::HashMap<Uuid, Vec<PostMedia>> = std::collections::HashMap::new();
    for media in media_list {
        media_by_post.entry(media.post_id).or_default().push(media);
    }

    // Get likes counts in one query
    let likes_counts = post_likes::post_likes
        .filter(post_likes::post_id.eq_any(&post_ids))
        .group_by(post_likes::post_id)
        .select((post_likes::post_id, count(post_likes::id)))
        .load::<(Uuid, i64)>(&mut conn)
        .expect("Error loading likes counts");

    // Get user's likes in one query if user is logged in
    let user_likes = if let Some(user_id) = current_user_id {
        post_likes::post_likes
            .filter(post_likes::user_id.eq(user_id))
            .filter(post_likes::post_id.eq_any(&post_ids))
            .select(post_likes::post_id)
            .load::<Uuid>(&mut conn)
            .expect("Error loading user likes")
    } else {
        Vec::new()
    };

    // Get most recent edit for each post
    let edit_history = post_edit_history::post_edit_history
        .filter(post_edit_history::post_id.eq_any(&post_ids))
        .select((post_edit_history::post_id, post_edit_history::edited_at))
        .order_by(post_edit_history::edited_at.desc())
        .load::<(Uuid, DateTime<Utc>)>(&mut conn)
        .expect("Error loading edit history");

    // Group edit history by post_id and take the most recent one
    let mut edit_by_post: std::collections::HashMap<Uuid, DateTime<Utc>> = std::collections::HashMap::new();
    for (post_id, edited_at) in edit_history {
        edit_by_post.entry(post_id).or_insert(edited_at);
    }

    let likes_count_map: std::collections::HashMap<Uuid, i64> = likes_counts.into_iter().collect();
    let user_likes_set: std::collections::HashSet<Uuid> = user_likes.into_iter().collect();

    let mut response = Vec::new();
    for (post, author) in posts_list {
        let post_id = post.id;
        let is_author = current_user_id.map_or(false, |id| id == author.id);
        let is_liked = user_likes_set.contains(&post_id);
        let likes_count = likes_count_map.get(&post_id).copied().unwrap_or(0);
        let media = media_by_post.remove(&post_id).unwrap_or_default();
        let edited_at = edit_by_post.get(&post_id).copied();

        response.push(Post {
            post,
            media,
            author,
            is_author,
            is_liked,
            likes_count,
            replies_count: 0,
            edited_at,
        });
    }

    HttpResponse::Ok().json(response)
}

