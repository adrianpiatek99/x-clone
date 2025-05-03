use diesel::{Queryable, Selectable, Identifiable, Insertable};
use chrono::{DateTime, Utc};
use serde::Serialize;
use regex::Regex;
use validator::Validate;
use serde::Deserialize;

use crate::enums::user_role::Role;

#[derive(Queryable, Selectable, Identifiable, Serialize)]
#[diesel(table_name = crate::schema::users)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[serde(rename_all = "camelCase")]
pub struct CurrentUser {
  pub id: uuid::Uuid,
  pub name: String,
  pub screen_name: String,
  pub email: String,
  pub description: String,
  pub avatar_url: String,
  pub banner_url: String,
  pub url: Option<String>,
  pub role: Role,
  pub is_verified: bool,
  pub verified_at: Option<DateTime<Utc>>,
  pub created_at: DateTime<Utc>,
  pub updated_at: DateTime<Utc>,
}

#[derive(Queryable, Selectable, Identifiable, Serialize)]
#[diesel(table_name = crate::schema::users)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[serde(rename_all = "camelCase")]
pub struct User {
  pub id: uuid::Uuid,
  pub name: String,
  pub screen_name: String,
  pub description: String,
  pub avatar_url: String,
  pub banner_url: String,
  pub url: Option<String>,
  pub role: Role,
  pub is_verified: bool,
  pub verified_at: Option<DateTime<Utc>>,
  pub created_at: DateTime<Utc>,
  pub updated_at: DateTime<Utc>,
}

#[derive(Insertable)]
#[diesel(table_name = crate::schema::users)]
pub struct NewUser {
    pub id: uuid::Uuid,
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
            id: uuid::Uuid::new_v4(),
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

// Register request
lazy_static::lazy_static! {
  static ref SCREEN_NAME_REGEX: Regex = Regex::new(r"^[a-zA-Z0-9][a-zA-Z0-9_]*$").unwrap();
  static ref NAME_REGEX: Regex = Regex::new(r"^[\p{L}0-9]+(?:[\s-][\p{L}0-9]+)*$").unwrap();
}

#[derive(Deserialize, Validate)]
pub struct RegisterRequest {
  #[validate(length(min = 4, max = 50, message = "Name must be between 4 and 50 characters"))]
  #[validate(regex(path = "*NAME_REGEX", message = "Name can only contain letters, numbers, spaces, and hyphens"))]
  pub name: String,

  #[serde(rename = "screenName")]
  #[validate(length(min = 4, max = 15, message = "Screen name must be between 4 and 15 characters"))]
  #[validate(regex(path = "*SCREEN_NAME_REGEX", message = "Screen name must start with a letter or number and can only contain letters, numbers, and underscores"))]
  pub screen_name: String,

  #[validate(email(message = "Invalid email format"))]
  #[validate(length(max = 100, message = "Email must be less than 255 characters"))]
  pub email: String,

  #[validate(length(min = 6, max = 32, message = "Password must be between 6 and 32 characters"))]
  pub password: String,
}
