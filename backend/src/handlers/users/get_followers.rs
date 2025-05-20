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
        user::{Follow, ProfileUser, UserSelect},
    },
    schema::{follows::dsl as follows, users::dsl as users},
};

#[derive(Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/user.ts")]
#[allow(dead_code)]
pub struct GetFollowersParams {
    #[serde(skip_deserializing)]
    pub screen_name: String,
    #[ts(type = "Cursor | null")]
    pub cursor: Option<String>,
    #[ts(type = "number | null")]
    pub limit: Option<i64>,
}

#[derive(Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/user.ts")]
pub struct GetFollowersResponse {
    pub users: Vec<ProfileUser>,
    pub next_cursor: Option<Cursor>,
}

#[get("/followers/{screen_name}")]
async fn get_followers(
    db: web::Data<DbService>,
    req: HttpRequest,
    path: web::Path<String>,
    query: web::Query<GetFollowersParams>,
) -> HttpResponse {
    let session_user_id = try_get_session(&req).await;
    let mut conn = db.get_conn();

    let limit = query.limit.unwrap_or(20);
    let take = limit + 1;
    let cursor = query
        .cursor
        .as_ref()
        .and_then(|cursor_str| serde_json::from_str::<Cursor>(cursor_str).ok());

    // Get the target user's ID from screen_name
    let target_user = match users::users
        .filter(users::screen_name.eq(&path.into_inner()))
        .select(UserSelect::as_select())
        .first::<UserSelect>(&mut conn)
    {
        Ok(user) => user,
        Err(_) => {
            return HttpResponse::NotFound().body("User not found");
        }
    };

    let mut query = follows::follows
        .inner_join(users::users.on(follows::follower_id.eq(users::id)))
        .filter(follows::following_id.eq(target_user.id))
        .into_boxed();

    if let Some(c) = cursor {
        query = query.filter(
            follows::created_at.lt(c.created_at).or(follows::created_at
                .eq(c.created_at)
                .and(follows::id.lt(c.id))),
        );
    }

    let followers_list = match query
        .order(users::created_at.desc())
        .then_order_by(users::id.desc())
        .select((UserSelect::as_select(), Follow::as_select()))
        .limit(take)
        .load::<(UserSelect, Follow)>(&mut conn)
    {
        Ok(followers) => followers,
        Err(_) => {
            return HttpResponse::InternalServerError().body("Error loading followers");
        }
    };

    // Calculate next cursor
    let next_cursor = if followers_list.len() > limit as usize {
        let next_item = &followers_list[limit as usize - 1];
        Some(Cursor {
            id: next_item.0.id,
            created_at: next_item.0.created_at,
        })
    } else {
        None
    };

    // Take only the requested number of users
    let followers_list = followers_list
        .into_iter()
        .take(limit as usize)
        .collect::<Vec<_>>();
    let user_ids: Vec<Uuid> = followers_list.iter().map(|(user, _)| user.id).collect();

    // Execute all related queries in a single transaction
    let result = match conn.transaction(|conn| {
        // Get followers and following counts for all users
        let (followers_counts, following_counts) = {
            let followers = follows::follows
                .filter(follows::following_id.eq_any(&user_ids))
                .group_by(follows::following_id)
                .select((follows::following_id, count(follows::id)))
                .load::<(Uuid, i64)>(conn)?;

            let following = follows::follows
                .filter(follows::follower_id.eq_any(&user_ids))
                .group_by(follows::follower_id)
                .select((follows::follower_id, count(follows::id)))
                .load::<(Uuid, i64)>(conn)?;

            (followers, following)
        };

        // Get current user's following status for all users
        let user_following = if let Some(user_id) = session_user_id {
            follows::follows
                .filter(follows::follower_id.eq(user_id))
                .filter(follows::following_id.eq_any(&user_ids))
                .select(follows::following_id)
                .load::<Uuid>(conn)?
        } else {
            Vec::new()
        };

        Result::<_, diesel::result::Error>::Ok((followers_counts, following_counts, user_following))
    }) {
        Ok(data) => data,
        Err(_) => {
            return HttpResponse::InternalServerError().body("Error processing user data");
        }
    };

    let (followers_counts, following_counts, user_following) = result;

    // Create maps for quick lookup
    let followers_count_map: HashMap<Uuid, i64> = followers_counts.into_iter().collect();
    let following_count_map: HashMap<Uuid, i64> = following_counts.into_iter().collect();
    let user_following_set: HashSet<Uuid> = user_following.into_iter().collect();

    // Construct ProfileUser objects
    let users = followers_list
        .into_iter()
        .map(|(user, _)| {
            let user_id = user.id;

            ProfileUser {
                user,
                is_following: user_following_set.contains(&user_id),
                followers_count: *followers_count_map.get(&user_id).unwrap_or(&0),
                following_count: *following_count_map.get(&user_id).unwrap_or(&0),
            }
        })
        .collect();

    let response = GetFollowersResponse { users, next_cursor };

    HttpResponse::Ok().json(response)
}
