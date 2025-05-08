use actix_web::{HttpRequest, HttpResponse};
use uuid::Uuid;
use std::env;

use crate::helpers::token::{decode_token, is_token_valid};

pub async fn require_session(req: &HttpRequest) -> Option<Uuid> {
    let token = match req.cookie("AUTH_TOKEN") {
        Some(cookie) => cookie.value().to_string(),
        None => {
            let _ = HttpResponse::Unauthorized().json(serde_json::json!({
                "error": "No authentication token provided"
            }));
            return None;
        }
    };

    let jwt_secret = match env::var("JWT_SECRET") {
        Ok(secret) => secret,
        Err(_) => {
            let _ = HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "JWT_SECRET not set"
            }));
            return None;
        }
    };

    let token_data = match decode_token(&token, &jwt_secret) {
        Ok(data) => data,
        Err(_) => {
            let _ = HttpResponse::Unauthorized().json(serde_json::json!({
                "error": "Invalid token"
            }));
            return None;
        }
    };

    if !is_token_valid(&token_data.claims) {
        let _ = HttpResponse::Unauthorized().json(serde_json::json!({
            "error": "Token expired"
        }));
        return None;
    }

    Some(token_data.claims.sub)
}

pub async fn try_get_session(req: &HttpRequest) -> Option<Uuid> {
    let token = req.cookie("AUTH_TOKEN")?.value().to_string();
    let jwt_secret = env::var("JWT_SECRET").ok()?;
    let token_data = decode_token(&token, &jwt_secret).ok()?;

    if !is_token_valid(&token_data.claims) {
        return None;
    }

    Some(token_data.claims.sub)
}