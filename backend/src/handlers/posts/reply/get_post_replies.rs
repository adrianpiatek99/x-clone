use actix_web::{HttpRequest, HttpResponse, get, web};
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

use crate::{
    db_service::DbService,
    handlers::middleware::try_get_session,
    models::{
        global::Cursor,
        post::{Post, PostSchema},
        user::{BaseUser, UserSelect},
    },
    schema::{posts::dsl as posts, users::dsl as users},
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

    // Final response
    let post_replies = replies_list
        .into_iter()
        .map(|(reply, author)| {
            let is_author = session_user_id.map_or(false, |id| id == author.id);

            Post {
                post: reply,
                author: BaseUser { user: author },
                media: vec![],
                is_author,
                is_liked: false,
                likes_count: 0,
                replies_count: 0,
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
