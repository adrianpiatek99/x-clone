use actix_web::{HttpRequest, HttpResponse, get, web};
use chrono::{DateTime, Utc};
use diesel::dsl::count;
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
        post::{Post, PostLikeSchema, PostMedia, PostSchema},
        user::{BaseUser, UserSelect},
    },
    schema::{
        post_edit_history::dsl as post_edit_history, post_likes::dsl as post_likes,
        post_media::dsl as post_media, post_reply::dsl as post_replies, posts::dsl as posts,
        users::dsl as users,
    },
};

#[derive(Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
#[allow(dead_code)]
pub struct GetUserLikesParams {
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
pub struct GetUserLikesResponse {
    pub posts: Vec<Post>,
    pub next_cursor: Option<Cursor>,
    #[ts(type = "number")]
    pub total_count: i64,
}

#[get("/userLikes/{screen_name}")]
async fn get_user_likes(
    db: web::Data<DbService>,
    req: HttpRequest,
    path: web::Path<String>,
    query: web::Query<GetUserLikesParams>,
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

    // Query likes with posts
    let mut query = post_likes::post_likes
        .inner_join(posts::posts)
        .inner_join(users::users.on(posts::author_id.eq(users::id)))
        .filter(post_likes::user_id.eq(user.id))
        .into_boxed();

    if let Some(c) = cursor {
        query = query.filter(
            post_likes::created_at
                .lt(c.created_at)
                .or(post_likes::created_at
                    .eq(c.created_at)
                    .and(post_likes::id.lt(c.id))),
        );
    }

    let likes_list = match query
        .order(post_likes::created_at.desc())
        .then_order_by(post_likes::id.desc())
        .select((
            PostLikeSchema::as_select(),
            PostSchema::as_select(),
            UserSelect::as_select(),
        ))
        .limit(take)
        .load::<(PostLikeSchema, PostSchema, UserSelect)>(&mut conn)
    {
        Ok(likes) => likes,
        Err(_) => {
            return HttpResponse::InternalServerError().body("Error loading likes");
        }
    };

    // Calculate next cursor
    let next_cursor = if likes_list.len() > limit as usize {
        let next_item = &likes_list[limit as usize - 1];
        Some(Cursor {
            id: next_item.0.id,
            created_at: next_item.0.created_at,
        })
    } else {
        None
    };

    // Take only the requested number of likes
    let likes_list = likes_list
        .into_iter()
        .take(limit as usize)
        .collect::<Vec<_>>();
    let post_ids: Vec<Uuid> = likes_list.iter().map(|(_, post, _)| post.id).collect();

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

            let replies = post_replies::post_reply
                .filter(post_replies::post_id.eq_any(&post_ids))
                .group_by(post_replies::post_id)
                .select((post_replies::post_id, count(post_replies::id)))
                .load::<(Uuid, i64)>(conn)?;

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
            return HttpResponse::InternalServerError().body("Error processing likes data");
        }
    };

    let (media_by_post, likes_counts, replies_counts, user_likes, edit_history) = result;

    // Get total count of likes for the user
    let total_count = match post_likes::post_likes
        .filter(post_likes::user_id.eq(user.id))
        .count()
        .get_result::<i64>(&mut conn)
    {
        Ok(count) => count,
        Err(_) => {
            return HttpResponse::InternalServerError().body("Error getting total count");
        }
    };

    let likes_count_map: HashMap<_, _> = likes_counts.into_iter().collect();
    let replies_count_map: HashMap<_, _> = replies_counts.into_iter().collect();
    let user_likes_set: HashSet<_> = user_likes.into_iter().collect();
    let edit_by_post: HashMap<_, _> = edit_history.into_iter().collect();

    // Final response
    let response_likes = likes_list
        .into_iter()
        .map(|(_, post, author)| {
            let post_id = post.id;
            let all_media = media_by_post.get(&post_id).cloned().unwrap_or_default();
            let is_author = session_user_id.map_or(false, |id| id == author.id);
            let is_liked = user_likes_set.contains(&post_id);
            let likes_count = *likes_count_map.get(&post_id).unwrap_or(&0);
            let replies_count = *replies_count_map.get(&post_id).unwrap_or(&0);
            let edited_at = edit_by_post.get(&post_id).copied();

            Post {
                post,
                author: BaseUser { user: author },
                media: all_media,
                is_author,
                is_liked,
                likes_count,
                replies_count,
                edited_at,
            }
        })
        .collect();

    let response = GetUserLikesResponse {
        posts: response_likes,
        next_cursor,
        total_count,
    };

    HttpResponse::Ok().json(response)
}
