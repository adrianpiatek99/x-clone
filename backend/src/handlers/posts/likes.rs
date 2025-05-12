use actix_web::{HttpResponse, get, web};
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

use crate::{
    db_service::DbService,
    models::{
        global::Cursor,
        post::{PostLike, PostLikeSchema},
        user::{BaseUser, UserSelect},
    },
    schema::{post_likes::dsl as post_likes, users::dsl as users},
};

#[derive(Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
#[allow(dead_code)]
pub struct GetPostLikesParams {
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
pub struct GetPostLikesResponse {
    pub post_likes: Vec<PostLike>,
    pub next_cursor: Option<Cursor>,
}

#[get("/postLikes/{post_id}")]
async fn get_post_likes(
    db: web::Data<DbService>,
    path: web::Path<String>,
    query: web::Query<GetPostLikesParams>,
) -> HttpResponse {
    let post_id = match Uuid::parse_str(&path.into_inner()) {
        Ok(id) => id,
        Err(_) => return HttpResponse::BadRequest().body("Invalid post ID format"),
    };
    let limit = query.limit.unwrap_or(10);
    let take = limit + 1;
    let cursor = query
        .cursor
        .as_ref()
        .and_then(|cursor_str| serde_json::from_str::<Cursor>(cursor_str).ok());

    let mut conn = db.get_conn();

    // Query post likes with join on user
    let mut query = post_likes::post_likes
        .inner_join(users::users)
        .filter(post_likes::post_id.eq(post_id))
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
        .select((PostLikeSchema::as_select(), UserSelect::as_select()))
        .limit(take)
        .load::<(PostLikeSchema, UserSelect)>(&mut conn)
    {
        Ok(likes) => likes,
        Err(_) => {
            return HttpResponse::InternalServerError().body("Error loading post likes");
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
    let post_likes = likes_list
        .into_iter()
        .take(limit as usize)
        .map(|(like, user)| PostLike {
            post: like,
            user: BaseUser { user },
        })
        .collect::<Vec<PostLike>>();

    let response = GetPostLikesResponse {
        post_likes,
        next_cursor,
    };

    HttpResponse::Ok().json(response)
}
