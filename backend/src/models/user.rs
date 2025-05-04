use diesel::{Queryable, Selectable, Identifiable, Insertable};
use chrono::{DateTime, Utc};
use serde::Serialize;
use uuid::Uuid;
use ts_rs::TS;

use crate::enums::user_role::Role;

#[derive(Queryable, Selectable, Identifiable, Serialize, TS)]
#[ts(export, export_to = "../../frontend/src/types/user.ts")]
#[diesel(table_name = crate::schema::users)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[serde(rename_all = "camelCase")]
pub struct CurrentUser {
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

#[derive(Queryable, Selectable, Identifiable, Serialize, TS, Clone)]
#[ts(export, export_to = "../../frontend/src/types/user.ts")]
#[diesel(table_name = crate::schema::users)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[serde(rename_all = "camelCase")]
pub struct User {
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