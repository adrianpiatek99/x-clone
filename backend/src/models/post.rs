use diesel::{Queryable, Selectable, Identifiable, Associations};
use serde::Serialize;
use chrono::{DateTime, Utc};
use uuid::Uuid;
use ts_rs::TS;

use crate::enums::conversation_control::ConversationControl;
use crate::enums::post_media_type::PostMediaType;
use crate::models::user::User;

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

#[derive(Queryable, Selectable, Identifiable, Serialize, Associations, Clone, TS, Debug)]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
#[diesel(table_name = crate::schema::post_media)]
#[diesel(belongs_to(Post))]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[serde(rename_all = "camelCase")]
pub struct PostMedia {
    pub id: Uuid,
    pub url: String,
    pub width: i32,
    pub height: i32,
    pub type_: PostMediaType,
    pub post_id: Uuid,
    pub user_id: Uuid,
    #[ts(type = "Date")]
    pub created_at: DateTime<Utc>,
}

#[derive(Serialize, TS, Debug)]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
#[serde(rename_all = "camelCase")]
pub struct Post {
    #[serde(flatten)]
    pub post: PostSchema,
    pub author: User,
    pub media: Vec<PostMedia>,
    pub is_author: bool,
    pub is_liked: bool,
    pub likes_count: i64,
    pub replies_count: i64,
    #[ts(type = "Date | null")]
    pub edited_at: Option<DateTime<Utc>>,
}

#[derive(Serialize, TS)]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
#[serde(rename_all = "camelCase")]
pub struct PostEditHistory {
    #[serde(flatten)]
    pub id: Uuid,
    pub post_id: Uuid,
    pub previous_text: String,
    #[ts(type = "Date | null")]
    pub edited_at: Option<DateTime<Utc>>,
}
