use chrono::{DateTime, Utc};
use diesel::{Identifiable, Insertable, Queryable, Selectable};
use serde::Serialize;
use ts_rs::TS;
use uuid::Uuid;

use crate::enums::user_role::Role;

// UserSelect is the user select for the public user
#[derive(Queryable, Selectable, Identifiable, Serialize, TS, Debug)]
#[diesel(table_name = crate::schema::users)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[serde(rename_all = "camelCase")]
pub struct UserSelect {
    pub id: Uuid,
    pub name: String,
    pub screen_name: String,
    pub description: String,
    pub avatar_url: String,
    pub banner_url: String,
    pub url: Option<String>,
    pub role: Role,
    pub is_verified: bool,
    #[ts(type = "Date | null")]
    pub verified_at: Option<DateTime<Utc>>,
    #[ts(type = "Date")]
    pub created_at: DateTime<Utc>,
    #[ts(type = "Date")]
    pub updated_at: DateTime<Utc>,
}

// AuthUserSelect is the user select for the auth user
#[derive(Queryable, Selectable, Serialize, TS, Debug)]
#[diesel(table_name = crate::schema::users)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[serde(rename_all = "camelCase")]
pub struct CurrentUserSelect {
    pub id: Uuid,
    pub name: String,
    pub screen_name: String,
    pub email: String,
    pub description: String,
    pub avatar_url: String,
    pub banner_url: String,
    pub url: Option<String>,
    pub role: Role,
    pub is_verified: bool,
    #[ts(type = "Date | null")]
    pub verified_at: Option<DateTime<Utc>>,
    #[ts(type = "Date")]
    pub created_at: DateTime<Utc>,
    #[ts(type = "Date")]
    pub updated_at: DateTime<Utc>,
}

// NewUser is the new user insert for the auth user
#[derive(Insertable)]
#[diesel(table_name = crate::schema::users)]
pub struct NewUser {
    pub id: Uuid,
    pub name: String,
    pub screen_name: String,
    pub email: String,
    pub password: String,
    pub avatar_url: String,
    pub banner_url: String,
    pub description: String,
    pub url: Option<String>,
    pub role: Role,
    pub is_verified: bool,
    pub verified_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl Default for NewUser {
    fn default() -> Self {
        let now = Utc::now();
        Self {
            id: Uuid::new_v4(),
            name: String::new(),
            screen_name: String::new(),
            email: String::new(),
            password: String::new(),
            avatar_url: String::new(),
            banner_url: String::new(),
            description: String::new(),
            url: None,
            role: Role::User,
            is_verified: false,
            verified_at: None,
            created_at: now,
            updated_at: now,
        }
    }
}

// BaseUser is the base user for the public user
#[derive(Queryable, Serialize, TS, Debug)]
#[diesel(table_name = crate::schema::users)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/user.ts")]
pub struct BaseUser {
    #[serde(flatten)]
    pub user: UserSelect,
}

// PublicUser is the public user for the public user
#[derive(Queryable, Serialize, TS, Debug)]
#[diesel(table_name = crate::schema::users)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/user.ts")]
pub struct PublicUser {
    #[serde(flatten)]
    pub user: UserSelect,
    pub is_following: bool,
    #[ts(type = "Number")]
    pub followers_count: i64,
    #[ts(type = "Number")]
    pub following_count: i64,
}

// AuthUser is the auth user for the auth user
#[derive(Queryable, Serialize, TS, Debug)]
#[diesel(table_name = crate::schema::users)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/user.ts")]
pub struct CurrentUser {
    #[serde(flatten)]
    pub user: CurrentUserSelect,
    pub is_following: bool,
    #[ts(type = "Number")]
    pub followers_count: i64,
    #[ts(type = "Number")]
    pub following_count: i64,
}
