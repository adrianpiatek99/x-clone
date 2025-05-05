use serde::{Deserialize, Serialize};
use regex::Regex;
use validator::Validate;
use ts_rs::TS;

use super::user::CurrentUser;

lazy_static::lazy_static! {
  static ref SCREEN_NAME_REGEX: Regex = Regex::new(r"^[a-zA-Z0-9][a-zA-Z0-9_]*$").unwrap();
  static ref NAME_REGEX: Regex = Regex::new(r"^[\p{L}0-9]+(?:[\s-][\p{L}0-9]+)*$").unwrap();
}

#[derive(Deserialize, Validate, TS)]
#[ts(export, export_to = "../../frontend/src/types/auth.ts")]
#[serde(rename_all = "camelCase")]
pub struct RegisterRequest {
  #[validate(length(min = 4, max = 50, message = "Name must be between 4 and 50 characters"))]
  #[validate(regex(path = "*NAME_REGEX", message = "Name can only contain letters, numbers, spaces, and hyphens"))]
  pub name: String,

  #[validate(length(min = 4, max = 15, message = "Screen name must be between 4 and 15 characters"))]
  #[validate(regex(path = "*SCREEN_NAME_REGEX", message = "Screen name must start with a letter or number and can only contain letters, numbers, and underscores"))]
  pub screen_name: String,

  #[validate(email(message = "Invalid email format"))]
  #[validate(length(max = 100, message = "Email must be less than 255 characters"))]
  pub email: String,

  #[validate(length(min = 6, max = 32, message = "Password must be between 6 and 32 characters"))]
  pub password: String,
}

#[derive(Deserialize, Validate, TS)]
#[ts(export, export_to = "../../frontend/src/types/auth.ts")]
#[serde(rename_all = "camelCase")]
pub struct LoginRequest {
  #[validate(length(max = 100, message = "Email or screen name must be less than 100 characters"))]
  pub email_or_screen_name: String,

  #[validate(length(min = 6, max = 32, message = "Password must be between 6 and 32 characters"))]
  pub password: String,
}

#[derive(Serialize, TS)]
#[ts(export, export_to = "../../frontend/src/types/auth.ts")]
#[serde(rename_all = "camelCase")]
pub struct LoginResponse {
    #[serde(flatten)]
    pub current_user: CurrentUser
}


