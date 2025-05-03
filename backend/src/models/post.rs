use diesel::{Queryable, Selectable, Identifiable};
use chrono::{DateTime, Utc};
use serde::Serialize;

use crate::enums::conversation_control::ConversationControl;
use crate::enums::post_media_type::PostMediaType;

#[derive(Queryable, Selectable, Identifiable, Serialize)]
#[diesel(table_name = crate::schema::posts)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[serde(rename_all = "camelCase")]
pub struct Post {
    pub id: uuid::Uuid,
    pub text: String,
    pub author_id: uuid::Uuid,
    pub hashtags: Option<Vec<Option<String>>>,
    pub conversationControl: ConversationControl,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}


#[derive(Queryable, Selectable, Identifiable, Serialize)]
#[diesel(table_name = crate::schema::post_media)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[serde(rename_all = "camelCase")]
pub struct PostMedia {
    pub id: uuid::Uuid,
    pub url: String,
    pub width: i32,
    pub height: i32,
    pub type_: PostMediaType,
    pub post_id: uuid::Uuid,
    pub user_id: uuid::Uuid,
    pub created_at: DateTime<Utc>,
}