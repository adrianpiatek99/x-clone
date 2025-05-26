use std::collections::HashMap;

use actix_web::{HttpRequest, HttpResponse, get, web};
use chrono::{DateTime, Utc};
use diesel::dsl::count_star;
use diesel::prelude::*;
use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl};
use serde::Serialize;
use ts_rs::TS;
use uuid::Uuid;

use crate::{
    db_service::DbService,
    handlers::middleware::try_get_session,
    models::{
        post::{Post, PostMedia, PostReplyInfo, PostSchema},
        user::{BaseUser, UserSelect},
    },
    schema::{
        post_edit_history::dsl as post_edit_history, post_likes::dsl as post_likes,
        post_media::dsl as post_media, posts::dsl as posts, users::dsl as users,
    },
};

#[derive(Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
pub struct GetPostDetailsParams {
    pub post_id: String,
}

#[derive(Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
pub struct GetPostDetailsResponse {
    pub posts: Vec<Post>,
}

#[get("/details/{post_id}")]
async fn post_details(
    db: web::Data<DbService>,
    path: web::Path<String>,
    req: HttpRequest,
) -> HttpResponse {
    let session_user_id = try_get_session(&req).await;
    let mut conn = db.get_conn();
    let pid_str = path.into_inner();

    let pid = match Uuid::parse_str(&pid_str) {
        Ok(uuid) => uuid,
        Err(_) => return HttpResponse::BadRequest().body("Invalid UUID format"),
    };

    // Optimized recursive query with materialized CTE
    let query = format!(
        r#"
        WITH RECURSIVE reply_chain AS (
            SELECT * FROM posts WHERE id = '{}'
            UNION ALL
            SELECT p.* FROM posts p
            JOIN reply_chain rc ON p.id = rc.reply_to_post_id
        ),
        materialized_chain AS (
            SELECT * FROM reply_chain
        )
        SELECT * FROM materialized_chain ORDER BY created_at ASC
        "#,
        pid
    );

    let chain: Vec<PostSchema> = match diesel::sql_query(query).load(&mut conn) {
        Ok(c) => c,
        Err(_) => return HttpResponse::InternalServerError().body("Failed to load chain"),
    };

    if chain.is_empty() {
        return HttpResponse::NotFound().body("Post not found");
    }

    let post_ids: Vec<Uuid> = chain.iter().map(|p| p.id).collect();
    let author_ids: Vec<Uuid> = chain.iter().map(|p| p.author_id).collect();

    // Fetch all authors in one query
    let authors = users::users
        .filter(users::id.eq_any(&author_ids))
        .select(UserSelect::as_select())
        .load::<UserSelect>(&mut conn)
        .unwrap_or_default()
        .into_iter()
        .map(|u| (u.id, u))
        .collect::<HashMap<Uuid, UserSelect>>();

    // Fetch all media in one query
    let media_map = post_media::post_media
        .filter(post_media::post_id.eq_any(&post_ids))
        .select(PostMedia::as_select())
        .load::<PostMedia>(&mut conn)
        .unwrap_or_default()
        .into_iter()
        .fold(HashMap::<Uuid, Vec<PostMedia>>::new(), |mut acc, media| {
            acc.entry(media.post_id).or_default().push(media);
            acc
        });

    // Fetch all likes counts in one query
    let likes_counts: HashMap<Uuid, i64> = post_likes::post_likes
        .filter(post_likes::post_id.eq_any(&post_ids))
        .group_by(post_likes::post_id)
        .select((post_likes::post_id, count_star()))
        .load::<(Uuid, i64)>(&mut conn)
        .unwrap_or_default()
        .into_iter()
        .collect();

    // Fetch all user likes in one query if user is logged in
    let user_likes: Vec<Uuid> = if let Some(uid) = session_user_id {
        post_likes::post_likes
            .filter(post_likes::post_id.eq_any(&post_ids))
            .filter(post_likes::user_id.eq(uid))
            .select(post_likes::post_id)
            .load::<Uuid>(&mut conn)
            .unwrap_or_default()
    } else {
        Vec::new()
    };

    // Fetch all reply counts in one query
    let reply_counts: HashMap<Uuid, i64> = posts::posts
        .filter(posts::reply_to_post_id.eq_any(&post_ids))
        .group_by(posts::reply_to_post_id)
        .select((posts::reply_to_post_id, count_star()))
        .load::<(Option<Uuid>, i64)>(&mut conn)
        .unwrap_or_default()
        .into_iter()
        .filter_map(|(id, count)| id.map(|id| (id, count)))
        .collect();

    // Fetch all edit history in one query
    let edit_history: HashMap<Uuid, DateTime<Utc>> = post_edit_history::post_edit_history
        .filter(post_edit_history::post_id.eq_any(&post_ids))
        .select((post_edit_history::post_id, post_edit_history::edited_at))
        .order_by(post_edit_history::edited_at.desc())
        .load::<(Uuid, DateTime<Utc>)>(&mut conn)
        .unwrap_or_default()
        .into_iter()
        .fold(HashMap::new(), |mut acc, (post_id, edited_at)| {
            acc.entry(post_id).or_insert(edited_at);
            acc
        });

    // Fetch all reply-to users in one query
    let reply_to_ids: Vec<Uuid> = chain.iter().filter_map(|p| p.reply_to_post_id).collect();
    println!("reply_to_ids: {:?}", reply_to_ids);

    let reply_to_users: HashMap<Uuid, UserSelect> = if !reply_to_ids.is_empty() {
        posts::posts
            .inner_join(users::users.on(posts::author_id.eq(users::id)))
            .filter(posts::id.eq_any(&reply_to_ids))
            .select((posts::id, UserSelect::as_select()))
            .load::<(Uuid, UserSelect)>(&mut conn)
            .unwrap_or_default()
            .into_iter()
            .map(|(post_id, user)| (post_id, user))
            .collect()
    } else {
        HashMap::new()
    };

    let posts_full = chain
        .into_iter()
        .map(|post| {
            let author = authors.get(&post.author_id).cloned();
            let media = media_map.get(&post.id).cloned().unwrap_or_default();
            let author_id = post.author_id;

            let likes_count = likes_counts.get(&post.id).copied().unwrap_or(0);
            let is_liked = user_likes.contains(&post.id);
            let replies_count = reply_counts.get(&post.id).copied().unwrap_or(0);
            let edited_at = edit_history.get(&post.id).copied();

            let reply_to_user = post.reply_to_post_id.and_then(|id| {
                reply_to_users
                    .get(&id)
                    .cloned()
                    .map(|u| BaseUser { user: u })
            });

            let reply = post
                .reply_to_post_id
                .zip(reply_to_user)
                .map(|(id, user)| PostReplyInfo { id, user });

            Post {
                post,
                author: BaseUser {
                    user: author.expect("Author must exist"),
                },
                reply,
                media,
                is_author: session_user_id.map_or(false, |id| id == author_id),
                is_liked,
                likes_count,
                replies_count,
                edited_at,
            }
        })
        .collect();

    HttpResponse::Ok().json(GetPostDetailsResponse { posts: posts_full })
}
