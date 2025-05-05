use jsonwebtoken::{decode, encode, Header, Validation, EncodingKey, DecodingKey, TokenData};
use serde::{Deserialize, Serialize};
use chrono::{Duration, Utc};
use sha2::{Sha256, Digest};
use uuid::Uuid;

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