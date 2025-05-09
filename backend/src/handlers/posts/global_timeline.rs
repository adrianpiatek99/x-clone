use actix_web::{get, web, HttpResponse, HttpRequest};
use diesel::{QueryDsl, RunQueryDsl, ExpressionMethods};
use diesel::prelude::*;
use diesel::dsl::count;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

use crate::db_service::DbService;
use crate::handlers::middleware::try_get_session;

use crate::schema::posts::dsl as posts;
use crate::schema::post_media::dsl as post_media;
use crate::schema::users::dsl as users;
use crate::schema::post_likes::dsl as post_likes;
use crate::schema::post_edit_history::dsl as post_edit_history;
use crate::schema::post_reply::dsl as post_replies;

use crate::models::post::*;
use crate::models::global::Cursor;
use crate::models::user::{BaseUser, UserSelect};

#[derive(Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
pub struct GetGlobalTimelineParams {
    #[ts(type = "Cursor | null")]
    pub cursor: Option<String>,
    #[ts(type = "Number | null")]
    pub limit: Option<i64>,
}

#[derive(Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
pub struct GetGlobalTimelineResponse {
    pub posts: Vec<Post>,
    pub next_cursor: Option<Cursor>,
}


#[get("/globalTimeline")]
async fn global_timeline(
    db: web::Data<DbService>,
    req: HttpRequest,
    query: web::Query<GetGlobalTimelineParams>,
) -> HttpResponse {
    let session_user_id = try_get_session(&req).await;
    let mut conn = db.get_conn();

    let limit = query.limit.unwrap_or(20);
    let take = limit + 1;
    let cursor = query.cursor.as_ref().and_then(|cursor_str| {
        serde_json::from_str::<Cursor>(cursor_str).ok()
    });

    // Query posts with join on author
    let mut query = posts::posts
        .inner_join(users::users)
        .into_boxed();

    if let Some(c) = cursor {
        query = query.filter(
            posts::created_at.lt(c.created_at)
                .or(posts::created_at.eq(c.created_at).and(posts::id.lt(c.id))),
        );
    }

    let posts_list = query
        .order(posts::created_at.desc())
        .then_order_by(posts::id.desc())
        .select((PostSchema::as_select(), UserSelect::as_select()))
        .limit(take)
        .load::<(PostSchema, UserSelect)>(&mut conn)
        .expect("Error loading posts");

    // Calculate next cursor
    let next_cursor = if posts_list.len() > limit as usize {
        let next_item = &posts_list[limit as usize - 1];
        Some(Cursor {
            id: next_item.0.id,
            created_at: next_item.0.created_at,
        })
    } else {
        None
    };

    // Take only the requested number of posts
    let posts_list = posts_list.into_iter().take(limit as usize).collect::<Vec<_>>();

    let post_ids: Vec<Uuid> = posts_list.iter().map(|(post, _)| post.id).collect();

    // Media
    let media_list = post_media::post_media
        .filter(post_media::post_id.eq_any(&post_ids))
        .load::<PostMedia>(&mut conn)
        .expect("Error loading media");

    let mut media_by_post: std::collections::HashMap<Uuid, Vec<PostMedia>> = std::collections::HashMap::new();
    for media in media_list {
        media_by_post.entry(media.post_id).or_default().push(media);
    }

    // Likes count
    let likes_counts = post_likes::post_likes
        .filter(post_likes::post_id.eq_any(&post_ids))
        .group_by(post_likes::post_id)
        .select((post_likes::post_id, count(post_likes::id)))
        .load::<(Uuid, i64)>(&mut conn)
        .expect("Error loading likes counts");

    // Replies count
    let replies_counts = post_replies::post_reply
        .filter(post_replies::post_id.eq_any(&post_ids))
        .group_by(post_replies::post_id)
        .select((post_replies::post_id, count(post_replies::id)))
        .load::<(Uuid, i64)>(&mut conn)
        .expect("Error loading replies counts");

    // User's likes
    let user_likes = if let Some(user_id) = session_user_id {
        post_likes::post_likes
            .filter(post_likes::user_id.eq(user_id))
            .filter(post_likes::post_id.eq_any(&post_ids))
            .select(post_likes::post_id)
            .load::<Uuid>(&mut conn)
            .expect("Error loading user likes")
    } else {
        Vec::new()
    };

    // Latest edit
    let edit_history = post_edit_history::post_edit_history
        .filter(post_edit_history::post_id.eq_any(&post_ids))
        .select((post_edit_history::post_id, post_edit_history::edited_at))
        .order_by(post_edit_history::edited_at.desc())
        .load::<(Uuid, DateTime<Utc>)>(&mut conn)
        .expect("Error loading edit history");

    let edit_by_post = edit_history.into_iter()
        .fold(std::collections::HashMap::new(), |mut acc, (post_id, edited_at)| {
            acc.entry(post_id).or_insert(edited_at);
            acc
        });

    let likes_count_map = likes_counts.into_iter().collect::<std::collections::HashMap<_, _>>();
    let replies_count_map = replies_counts.into_iter().collect::<std::collections::HashMap<_, _>>();
    let user_likes_set = user_likes.into_iter().collect::<std::collections::HashSet<_>>();

    // Final response
    let response_posts = posts_list.into_iter().map(|(post, author)| {
        let post_id = post.id;
        let is_author = session_user_id.map_or(false, |id| id == author.id);
        let is_liked = user_likes_set.contains(&post_id);
        let likes_count = *likes_count_map.get(&post_id).unwrap_or(&0);
        let replies_count = *replies_count_map.get(&post_id).unwrap_or(&0);
        let edited_at = edit_by_post.get(&post_id).copied();
        let media = media_by_post.remove(&post_id).unwrap_or_default();

        Post {
            post,
            author: BaseUser { user: author },
            media,
            is_author,
            is_liked,
            likes_count,
            replies_count,
            edited_at,
        }
    }).collect();

    let response = GetGlobalTimelineResponse {
        posts: response_posts,
        next_cursor,
    };

    HttpResponse::Ok().json(response)
}

