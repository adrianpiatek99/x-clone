use chrono::{DateTime, Utc};
use diesel::{Identifiable, Insertable, Queryable, Selectable};
use serde::Serialize;
use ts_rs::TS;
use uuid::Uuid;

use crate::enums::{conversation_control::ConversationControl, post_media_type::PostMediaType};

use super::user::BaseUser;

#[derive(Queryable, Selectable, Insertable, Identifiable, Serialize, TS, Debug)]
#[diesel(table_name = crate::schema::posts)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[serde(rename_all = "camelCase")]
pub struct PostSchema {
    pub id: Uuid,
    pub text: String,
    pub author_id: Uuid,
    pub hashtags: Option<Vec<Option<String>>>,
    pub conversation_control: ConversationControl,
    #[ts(type = "Date")]
    pub created_at: DateTime<Utc>,
    #[ts(type = "Date")]
    pub updated_at: DateTime<Utc>,
}

impl Default for PostSchema {
    fn default() -> Self {
        let now = Utc::now();

        Self {
            id: Uuid::new_v4(),
            text: String::new(),
            author_id: Uuid::new_v4(),
            hashtags: None,
            conversation_control: ConversationControl::ALL,
            created_at: now,
            updated_at: now,
        }
    }
}

#[derive(Queryable, Selectable, Identifiable, Insertable, Serialize, Clone, TS, Debug)]
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

impl Default for PostMedia {
    fn default() -> Self {
        let now = Utc::now();

        Self {
            id: Uuid::new_v4(),
            url: String::new(),
            width: 0,
            height: 0,
            type_: PostMediaType::PHOTO,
            post_id: Uuid::new_v4(),
            user_id: Uuid::new_v4(),
            created_at: now,
        }
    }
}

#[derive(Queryable, Selectable, Insertable, Identifiable, Serialize, Clone, TS, Debug)]
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

impl Default for PostLikeSchema {
    fn default() -> Self {
        let now = Utc::now();

        Self {
            id: Uuid::new_v4(),
            post_id: Uuid::new_v4(),
            user_id: Uuid::new_v4(),
            created_at: now,
        }
    }
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

#[derive(Serialize, Selectable, Insertable, TS, Debug)]
#[diesel(table_name = crate::schema::post_edit_history)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/post.ts")]
pub struct PostEditHistory {
    pub id: Uuid,
    pub post_id: Uuid,
    pub previous_text: String,
    #[ts(type = "Date")]
    pub edited_at: DateTime<Utc>,
}

impl Default for PostEditHistory {
    fn default() -> Self {
        let now = Utc::now();

        Self {
            id: Uuid::new_v4(),
            post_id: Uuid::new_v4(),
            previous_text: String::new(),
            edited_at: now,
        }
    }
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
