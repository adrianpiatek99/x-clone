use actix_web::{HttpRequest, dev::ServiceRequest, Error, HttpResponse};
use actix_web_httpauth::extractors::bearer::BearerAuth;
use std::env;
use serde_json::json;

use crate::models::auth::{decode_token, is_token_valid};

pub async fn auth_middleware(
    req: ServiceRequest,
    credentials: BearerAuth,
) -> Result<ServiceRequest, (Error, ServiceRequest)> {
    let jwt_secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set in .env file");

    match decode_token(credentials.token(), &jwt_secret) {
        Ok(token_data) => {
            if !is_token_valid(&token_data.claims) {
                return Err((
                    Error::from(actix_web::error::ErrorUnauthorized("Token expired")),
                    req,
                ));
            }
            Ok(req)
        }
        Err(_) => {
            Err((
                Error::from(actix_web::error::ErrorUnauthorized("Invalid token")),
                req,
            ))
        }
    }
}

pub async fn get_user_id_from_token(req: &HttpRequest) -> Result<uuid::Uuid, HttpResponse> {
    let token = match req.headers().get("Authorization") {
        Some(header) => {
            let header_str = header.to_str().map_err(|_| HttpResponse::Unauthorized().json(json!({
                "error": "Invalid Authorization header"
            })))?;

            if !header_str.starts_with("Bearer ") {
                return Err(HttpResponse::Unauthorized().json(json!({
                    "error": "Invalid Authorization header format"
                })));
            }

            header_str[7..].to_string()
        },
        None => return Err(HttpResponse::Unauthorized().json(json!({
            "error": "No authentication token provided"
        }))),
    };

    let jwt_secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set in .env file");

    match decode_token(&token, &jwt_secret) {
        Ok(token_data) => {
            if !is_token_valid(&token_data.claims) {
                return Err(HttpResponse::Unauthorized().json(json!({
                    "error": "Token expired"
                })));
            }
            Ok(token_data.claims.sub)
        }
        Err(_) => Err(HttpResponse::Unauthorized().json(json!({
            "error": "Invalid token"
        })))
    }
}