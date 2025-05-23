use actix_web::{HttpRequest, HttpResponse, get, web};
use chrono::{DateTime, Utc};
use diesel::dsl::{count_star, exists, select};
use diesel::prelude::*;
use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl};
use serde::Serialize;
use ts_rs::TS;
use uuid::Uuid;

use crate::{
    db_service::DbService,
    handlers::middleware::try_get_session,
    models::{
        post::{Post, PostMedia, PostSchema},
        user::{BaseUser, UserSelect},
    },
    schema::{
        post_edit_history::dsl as post_edit_history, post_likes::dsl as post_likes,
        post_media::dsl as post_media, post_replies::dsl as post_replies, posts::dsl as posts,
        users::dsl as users,
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
    #[serde(flatten)]
    pub post: Post,
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

    // Fetch post and author with a single query
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
        Err(_) => {
            return HttpResponse::InternalServerError().body("Internal server error");
        }
    };

    // Execute multiple queries concurrently using a transaction
    let result = match conn.transaction(|conn| {
        // Media query
        let media = post_media::post_media
            .filter(post_media::post_id.eq(post.id))
            .load::<PostMedia>(conn)?;

        // Combined likes count and is_liked query
        let (likes_count, is_liked) = {
            let likes_count = post_likes::post_likes
                .filter(post_likes::post_id.eq(post.id))
                .select(count_star())
                .first::<i64>(conn)
                .unwrap_or(0);

            let is_liked = if let Some(user_id) = session_user_id {
                select(exists(
                    post_likes::post_likes
                        .filter(post_likes::post_id.eq(post.id))
                        .filter(post_likes::user_id.eq(user_id)),
                ))
                .get_result::<bool>(conn)
                .unwrap_or(false)
            } else {
                false
            };

            (likes_count, is_liked)
        };

        let replies_count = post_replies::post_replies
            .filter(post_replies::post_id.eq(post.id))
            .count()
            .get_result::<i64>(conn)
            .unwrap_or(0);

        // Last edit query
        let edited_at = post_edit_history::post_edit_history
            .filter(post_edit_history::post_id.eq(post.id))
            .select(post_edit_history::edited_at)
            .order_by(post_edit_history::edited_at.desc())
            .limit(1)
            .first::<DateTime<Utc>>(conn)
            .ok();

        Result::<_, diesel::result::Error>::Ok((
            media,
            likes_count,
            is_liked,
            replies_count,
            edited_at,
        ))
    }) {
        Ok(data) => data,
        Err(_) => {
            return HttpResponse::InternalServerError().body("Internal server error");
        }
    };

    let (media, likes_count, is_liked, replies_count, edited_at) = result;

    // Determine if current user is author
    let is_author = session_user_id.map_or(false, |id| id == author.id);

    let response = GetPostDetailsResponse {
        post: Post {
            post,
            author: BaseUser { user: author },
            media,
            is_author,
            is_liked,
            likes_count,
            replies_count,
            edited_at,
        },
    };

    HttpResponse::Ok().json(response)
}
