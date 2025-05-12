use chrono::{DateTime, Utc};
use diesel::{Identifiable, Queryable, Selectable};
use serde::Serialize;
use ts_rs::TS;
use uuid::Uuid;

use crate::enums::conversation_control::ConversationControl;
use crate::enums::post_media_type::PostMediaType;

use super::user::BaseUser;

#[derive(Queryable, Selectable, Identifiable, Serialize, TS, Debug)]
#[diesel(table_name = crate::schema::posts)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[serde(rename_all = "camelCase")]
pub struct PostSchema {
    pub id: Uuid,
    pub text: String,
    pub author_id: Uuid,
    pub hashtags: Option<Vec<Option<String>>>,
    pub conversationControl: ConversationControl,
    #[ts(type = "Date")]
    pub created_at: DateTime<Utc>,
    #[ts(type = "Date")]
    pub updated_at: DateTime<Utc>,
}

#[derive(Queryable, Selectable, Identifiable, Serialize, Clone, TS, Debug)]
#[diesel(table_name = crate::schema::post_media)]
#[diesel(belongs_to(Post))]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
pub struct PostMedia {
    pub id: Uuid,
    pub url: String,
    #[ts(type = "number")]
    pub width: i32,
    #[ts(type = "number")]
    pub height: i32,
    pub type_: PostMediaType,
    pub post_id: Uuid,
    pub user_id: Uuid,
    #[ts(type = "Date")]
    pub created_at: DateTime<Utc>,
}

#[derive(Queryable, Selectable, Identifiable, Serialize, Clone, TS, Debug)]
#[diesel(table_name = crate::schema::post_likes)]
#[diesel(belongs_to(Post))]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
pub struct PostLikeSchema {
    pub id: Uuid,
    pub post_id: Uuid,
    pub user_id: Uuid,
    #[ts(type = "Date")]
    pub created_at: DateTime<Utc>,
}

#[derive(Queryable, Serialize, TS, Debug)]
#[diesel(table_name = crate::schema::posts)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
pub struct Post {
    #[serde(flatten)]
    pub post: PostSchema,
    pub author: BaseUser,
    pub media: Vec<PostMedia>,
    pub is_author: bool,
    pub is_liked: bool,
    #[ts(type = "number")]
    pub likes_count: i64,
    #[ts(type = "number")]
    pub replies_count: i64,
    #[ts(type = "Date | null")]
    pub edited_at: Option<DateTime<Utc>>,
}

#[derive(Serialize, TS, Debug)]
#[serde(rename_all = "camelCase")]
pub struct PostEditHistory {
    #[serde(flatten)]
    pub id: Uuid,
    pub post_id: Uuid,
    pub previous_text: String,
    #[ts(type = "Date | null")]
    pub edited_at: Option<DateTime<Utc>>,
}

#[derive(Queryable, Serialize, TS, Debug)]
#[diesel(table_name = crate::schema::posts)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
pub struct PostLike {
    #[serde(flatten)]
    pub post: PostLikeSchema,
    pub user: BaseUser,
}
