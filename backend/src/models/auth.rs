use serde::{Deserialize, Serialize};
use jsonwebtoken::{decode, encode, Header, Validation, EncodingKey, DecodingKey, TokenData};
use sha2::{Sha256, Digest};
use uuid::Uuid;
use chrono::{Duration, Utc};
use regex::Regex;
use validator::Validate;
use ts_rs::TS;

use crate::models::user::User;

// Register request

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
    pub user: User,
}

// JWT

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: Uuid,
    pub exp: i64,
}

pub fn generate_token(id: Uuid, secret: &str) -> Result<String, jsonwebtoken::errors::Error> {
    let expiration = Utc::now().checked_add_signed(Duration::seconds(60 * 60 * 24 * 30)).expect("Failed to add 30 days to current time").timestamp();

    let claims = Claims {
        sub: id,
        exp: expiration,
    };

    let header = Header::new(jsonwebtoken::Algorithm::HS256);
    let key = EncodingKey::from_secret(secret.as_bytes());

    encode(&header, &claims, &key)
}

pub fn decode_token(token: &str, secret: &str) -> Result<TokenData<Claims>, jsonwebtoken::errors::Error> {
    let key = DecodingKey::from_secret(secret.as_bytes());
    let validation = Validation::new(jsonwebtoken::Algorithm::HS256);

    decode::<Claims>(token, &key, &validation)
}

pub fn is_token_valid(claims: &Claims) -> bool {
    let current_time = Utc::now().timestamp();
    let is_valid = claims.exp > current_time;

    is_valid
}

pub fn hash_password(password: String) -> String {
  let mut hasher = Sha256::new();

  hasher.update(password.as_bytes());

  let hashed_password = hasher.finalize();

  hex::encode(hashed_password)
}

pub fn extend_token_expiration(claims: &mut Claims) {
    let new_expiration = Utc::now().checked_add_signed(Duration::seconds(60 * 60 * 24 * 30)).expect("Failed to add 30 days to current time").timestamp();
    claims.exp = new_expiration;
}