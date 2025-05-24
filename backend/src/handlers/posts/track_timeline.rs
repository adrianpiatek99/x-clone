use actix_web::{HttpResponse, get, web};
use chrono::{DateTime, Utc};
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

use crate::{db_service::DbService, schema::posts::dsl as posts};

#[derive(Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
pub struct GetTrackTimelineParams {
    pub latest_post_id: String,
}

#[derive(Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
pub struct GetTrackTimelineResponse {
    #[ts(type = "number")]
    pub new_posts_count: i64,
}

#[get("/trackTimeline")]
async fn track_timeline(
    db: web::Data<DbService>,
    query: web::Query<GetTrackTimelineParams>,
) -> HttpResponse {
    let pid_str = query.latest_post_id.clone();

    let pid = match Uuid::parse_str(&pid_str) {
        Ok(uuid) => uuid,
        Err(_) => return HttpResponse::BadRequest().body("Invalid UUID format"),
    };

    let mut conn = db.get_conn();

    // Find the reference post to get its creation time
    let reference_post = match posts::posts
        .filter(posts::id.eq(pid))
        .select(posts::created_at)
        .first::<DateTime<Utc>>(&mut conn)
    {
        Ok(post) => post,
        Err(_) => return HttpResponse::NotFound().body("Post not found"),
    };

    // Count new posts created after the reference post
    let new_posts_count = match posts::posts
        .filter(posts::created_at.gt(reference_post))
        .filter(posts::reply_to_post_id.is_null())
        .filter(posts::id.ne(pid))
        .count()
        .get_result::<i64>(&mut conn)
    {
        Ok(count) => count,
        Err(_) => return HttpResponse::InternalServerError().body("Database error"),
    };

    let response = GetTrackTimelineResponse { new_posts_count };

    HttpResponse::Ok().json(response)
}
