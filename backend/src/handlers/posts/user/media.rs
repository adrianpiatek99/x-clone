use actix_web::{HttpRequest, HttpResponse, get, web};
use chrono::{DateTime, Utc};
use diesel::dsl::{count, exists};
use diesel::prelude::*;
use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl};
use serde::{Deserialize, Serialize};
use std::collections::{HashMap, HashSet};
use ts_rs::TS;
use uuid::Uuid;

use crate::{
    db_service::DbService,
    handlers::middleware::try_get_session,
    models::{
        global::Cursor,
        post::{Post, PostMedia, PostSchema},
        user::{BaseUser, UserSelect},
    },
    schema::{
        post_edit_history::dsl as post_edit_history, post_likes::dsl as post_likes,
        post_media::dsl as post_media, posts::dsl as posts, users::dsl as users,
    },
};

#[derive(Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
#[allow(dead_code)]
pub struct GetUserMediaParams {
    #[serde(skip_deserializing)]
    pub screen_name: String,
    #[ts(type = "Cursor | null")]
    pub cursor: Option<String>,
    #[ts(type = "number | null")]
    pub limit: Option<i64>,
}

#[derive(Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
pub struct GetUserMediaResponse {
    pub posts: Vec<Post>,
    pub next_cursor: Option<Cursor>,
    #[ts(type = "number")]
    pub total_count: i64,
}

#[get("/userMedia/{screen_name}")]
async fn user_media(
    db: web::Data<DbService>,
    req: HttpRequest,
    path: web::Path<String>,
    query: web::Query<GetUserMediaParams>,
) -> HttpResponse {
    let session_user_id = try_get_session(&req).await;
    let mut conn = db.get_conn();

    let path_screen_name = path.into_inner();
    let limit = query.limit.unwrap_or(20);
    let take = limit + 1;
    let cursor = query
        .cursor
        .as_ref()
        .and_then(|cursor_str| serde_json::from_str::<Cursor>(cursor_str).ok());

    // Find user by screen_name first
    let user = match users::users
        .filter(users::screen_name.eq(&path_screen_name))
        .select(UserSelect::as_select())
        .first::<UserSelect>(&mut conn)
    {
        Ok(user) => user,
        Err(_) => {
            return HttpResponse::NotFound().body("User not found");
        }
    };

    // Query posts with join on author and media existence check
    let mut query = posts::posts
        .inner_join(users::users)
        .filter(posts::author_id.eq(user.id))
        .filter(posts::reply_to_post_id.is_null())
        .filter(exists(
            post_media::post_media
                .filter(post_media::post_id.eq(posts::id))
                .select(post_media::id),
        ))
        .into_boxed();

    if let Some(c) = cursor {
        query = query.filter(
            posts::created_at
                .lt(c.created_at)
                .or(posts::created_at.eq(c.created_at).and(posts::id.lt(c.id))),
        );
    }

    let posts_list = match query
        .order(posts::created_at.desc())
        .then_order_by(posts::id.desc())
        .select((PostSchema::as_select(), UserSelect::as_select()))
        .limit(take)
        .load::<(PostSchema, UserSelect)>(&mut conn)
    {
        Ok(posts) => posts,
        Err(_) => {
            return HttpResponse::InternalServerError().body("Error loading posts");
        }
    };

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
    let posts_list = posts_list
        .into_iter()
        .take(limit as usize)
        .collect::<Vec<_>>();
    let post_ids: Vec<Uuid> = posts_list.iter().map(|(post, _)| post.id).collect();

    // Get total count of posts with media
    let total_count = match posts::posts
        .filter(posts::reply_to_post_id.is_null())
        .filter(posts::author_id.eq(user.id))
        .filter(exists(
            post_media::post_media
                .filter(post_media::post_id.eq(posts::id))
                .select(post_media::id),
        ))
        .count()
        .get_result::<i64>(&mut conn)
    {
        Ok(count) => count,
        Err(_) => {
            return HttpResponse::InternalServerError().body("Error getting total count");
        }
    };

    // Execute all related queries in a single transaction
    let result = match conn.transaction(|conn| {
        // Media with post grouping
        let media_list = post_media::post_media
            .filter(post_media::post_id.eq_any(&post_ids))
            .load::<PostMedia>(conn)?;

        let mut media_by_post: HashMap<Uuid, Vec<PostMedia>> = HashMap::new();
        for media in media_list {
            media_by_post.entry(media.post_id).or_default().push(media);
        }

        // Combined likes and replies counts
        let (likes_counts, replies_counts) = {
            let likes = post_likes::post_likes
                .filter(post_likes::post_id.eq_any(&post_ids))
                .group_by(post_likes::post_id)
                .select((post_likes::post_id, count(post_likes::id)))
                .load::<(Uuid, i64)>(conn)?;

            let replies = posts::posts
                .filter(posts::reply_to_post_id.eq_any(&post_ids))
                .group_by(posts::reply_to_post_id)
                .select((posts::reply_to_post_id, count(posts::id)))
                .load::<(Option<Uuid>, i64)>(conn)?;

            (likes, replies)
        };

        // User's likes (if logged in)
        let user_likes = if let Some(user_id) = session_user_id {
            post_likes::post_likes
                .filter(post_likes::user_id.eq(user_id))
                .filter(post_likes::post_id.eq_any(&post_ids))
                .select(post_likes::post_id)
                .load::<Uuid>(conn)?
        } else {
            Vec::new()
        };

        // Latest edits with optimization
        let edit_history = post_edit_history::post_edit_history
            .filter(post_edit_history::post_id.eq_any(&post_ids))
            .distinct_on(post_edit_history::post_id)
            .select((post_edit_history::post_id, post_edit_history::edited_at))
            .order_by((
                post_edit_history::post_id,
                post_edit_history::edited_at.desc(),
            ))
            .load::<(Uuid, DateTime<Utc>)>(conn)?;

        Result::<_, diesel::result::Error>::Ok((
            media_by_post,
            likes_counts,
            replies_counts,
            user_likes,
            edit_history,
        ))
    }) {
        Ok(data) => data,
        Err(_) => {
            return HttpResponse::InternalServerError().body("Error processing posts data");
        }
    };

    let (media_by_post, likes_counts, replies_counts, user_likes, edit_history) = result;

    let likes_count_map: HashMap<_, _> = likes_counts.into_iter().collect();
    let replies_count_map: HashMap<_, _> = replies_counts.into_iter().collect();
    let user_likes_set: HashSet<_> = user_likes.into_iter().collect();
    let edit_by_post: HashMap<_, _> = edit_history.into_iter().collect();

    // Final response
    let response_posts = posts_list
        .into_iter()
        .map(|(post, author)| {
            let post_id = post.id;
            let all_media = media_by_post.get(&post_id).cloned().unwrap_or_default();
            let is_author = session_user_id.map_or(false, |id| id == author.id);
            let is_liked = user_likes_set.contains(&post_id);
            let likes_count = *likes_count_map.get(&post_id).unwrap_or(&0);
            let replies_count = *replies_count_map.get(&Some(post_id)).unwrap_or(&0);
            let edited_at = edit_by_post.get(&post_id).copied();

            Post {
                post,
                author: BaseUser { user: author },
                reply: None,
                media: all_media,
                is_author,
                is_liked,
                likes_count,
                replies_count,
                edited_at,
            }
        })
        .collect();

    let response = GetUserMediaResponse {
        posts: response_posts,
        next_cursor,
        total_count,
    };

    HttpResponse::Ok().json(response)
}
