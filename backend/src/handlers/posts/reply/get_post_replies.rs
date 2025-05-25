use actix_web::{HttpRequest, HttpResponse, get, web};
use diesel::dsl::count;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use std::collections::{HashMap, HashSet};
use ts_rs::TS;
use uuid::Uuid;

use crate::{
    db_service::DbService,
    handlers::middleware::try_get_session,
    models::{
        global::Cursor,
        post::{Post, PostReplyInfo, PostSchema},
        user::{BaseUser, UserSelect},
    },
    schema::{post_likes::dsl as post_likes, posts::dsl as posts, users::dsl as users},
};

#[derive(Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
#[allow(dead_code)]
pub struct GetPostRepliesParams {
    #[serde(skip_deserializing)]
    pub post_id: String,
    #[ts(type = "Cursor | null")]
    pub cursor: Option<String>,
    #[ts(type = "number | null")]
    pub limit: Option<i64>,
}

#[derive(Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
pub struct GetPostRepliesResponse {
    pub post_replies: Vec<Post>,
    pub next_cursor: Option<Cursor>,
}

#[get("/replies/{post_id}")]
async fn get_post_replies(
    db: web::Data<DbService>,
    req: HttpRequest,
    path: web::Path<String>,
    query: web::Query<GetPostRepliesParams>,
) -> HttpResponse {
    let session_user_id = try_get_session(&req).await;
    let mut conn = db.get_conn();
    let post_id = match Uuid::parse_str(&path.into_inner()) {
        Ok(id) => id,
        Err(_) => return HttpResponse::BadRequest().body("Invalid post ID"),
    };

    let limit = query.limit.unwrap_or(20);
    let take = limit + 1;
    let cursor = query
        .cursor
        .as_ref()
        .and_then(|cursor_str| serde_json::from_str::<Cursor>(cursor_str).ok());

    // Query post replies with join on author
    let mut query = posts::posts
        .inner_join(users::users)
        .filter(posts::reply_to_post_id.eq(post_id))
        .into_boxed();

    if let Some(c) = cursor {
        query = query.filter(
            posts::created_at
                .lt(c.created_at)
                .or(posts::created_at.eq(c.created_at).and(posts::id.lt(c.id))),
        );
    }

    let replies_list = match query
        .order(posts::created_at.desc())
        .then_order_by(posts::id.desc())
        .select((PostSchema::as_select(), UserSelect::as_select()))
        .limit(take)
        .load::<(PostSchema, UserSelect)>(&mut conn)
    {
        Ok(replies) => replies,
        Err(_) => {
            return HttpResponse::InternalServerError().body("Error loading replies");
        }
    };

    // Calculate next cursor
    let next_cursor = if replies_list.len() > limit as usize {
        let next_item = &replies_list[limit as usize - 1];
        Some(Cursor {
            id: next_item.0.id,
            created_at: next_item.0.created_at,
        })
    } else {
        None
    };

    // Take only the requested number of replies
    let replies_list = replies_list
        .into_iter()
        .take(limit as usize)
        .collect::<Vec<_>>();
    let post_ids: Vec<Uuid> = replies_list.iter().map(|(reply, _)| reply.id).collect();

    // Collect all reply_to_post_id values that are Some
    let reply_to_post_ids: Vec<Uuid> = replies_list
        .iter()
        .filter_map(|(reply, _)| reply.reply_to_post_id)
        .collect();

    // Execute all related queries in a single transaction
    let result = match conn.transaction(|conn| {
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

        // Fetch reply_to_user for each reply_to_post_id
        let reply_to_users = if !reply_to_post_ids.is_empty() {
            let users = users::users
                .inner_join(posts::posts.on(posts::author_id.eq(users::id)))
                .filter(posts::id.eq_any(&reply_to_post_ids))
                .select((posts::id, UserSelect::as_select()))
                .distinct()
                .load::<(Uuid, UserSelect)>(conn)?;
            users
        } else {
            Vec::new()
        };

        Result::<_, diesel::result::Error>::Ok((
            likes_counts,
            replies_counts,
            user_likes,
            reply_to_users,
        ))
    }) {
        Ok(data) => data,
        Err(_) => {
            return HttpResponse::InternalServerError().body("Error processing replies data");
        }
    };

    let (likes_counts, replies_counts, user_likes, reply_to_users) = result;

    let likes_count_map: HashMap<_, _> = likes_counts.into_iter().collect();
    let replies_count_map: HashMap<_, _> = replies_counts.into_iter().collect();
    let user_likes_set: HashSet<_> = user_likes.into_iter().collect();

    // Map reply_to_post_id to BaseUser
    let mut reply_to_user_map: HashMap<Uuid, BaseUser> = HashMap::new();
    for (post_id, user) in reply_to_users {
        reply_to_user_map.insert(post_id, BaseUser { user });
    }

    // Final response
    let post_replies = replies_list
        .into_iter()
        .map(|(post, author)| {
            let post_id = post.id;
            let is_author = session_user_id.map_or(false, |id| id == author.id);
            let is_liked = user_likes_set.contains(&post_id);
            let likes_count = *likes_count_map.get(&post_id).unwrap_or(&0);
            let replies_count = *replies_count_map.get(&Some(post_id)).unwrap_or(&0);
            let reply_to_user = post
                .reply_to_post_id
                .and_then(|id| reply_to_user_map.get(&id).cloned());
            let reply = if let Some(reply_to_user) = reply_to_user {
                Some(PostReplyInfo {
                    id: post.reply_to_post_id.unwrap(),
                    user: reply_to_user,
                })
            } else {
                None
            };

            Post {
                post,
                author: BaseUser { user: author },
                reply,
                media: vec![],
                is_author,
                is_liked,
                likes_count,
                replies_count,
                edited_at: None,
            }
        })
        .collect();

    let response = GetPostRepliesResponse {
        post_replies,
        next_cursor,
    };

    HttpResponse::Ok().json(response)
}
