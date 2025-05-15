use actix_multipart::Multipart;
use actix_web::{HttpRequest, HttpResponse, patch, web};
use chrono::{DateTime, Utc};
use diesel::prelude::AsChangeset;
use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl, SelectableHelper};
use futures::{StreamExt, TryStreamExt};
use serde::Deserialize;
use ts_rs::TS;
use validator::Validate;

use crate::{
    db_service::DbService,
    handlers::middleware::require_session,
    helpers::{
        file::{FILE_VALIDATION_CONFIGS, read_file_data, upload_file, validate_file},
        validation::{validate_description, validate_name},
    },
    models::user::CurrentUserSelect,
    schema::users::dsl as users,
};

#[derive(Deserialize, Validate, TS)]
#[serde(rename_all = "camelCase")]
#[allow(dead_code)]
#[ts(export, export_to = "../../frontend/src/types/user.ts")]
pub struct UpdateProfileRequest {
    #[validate(custom(function = "validate_name"))]
    pub name: String,

    #[validate(custom(function = "validate_description"))]
    pub description: String,

    #[validate(url(message = "Invalid URL format"))]
    pub url: Option<String>,

    pub remove_banner: Option<bool>,

    #[ts(type = "File | null")]
    pub avatar_file: Option<String>,

    #[ts(type = "File | null")]
    pub banner_file: Option<String>,
}

#[derive(AsChangeset, Default)]
#[diesel(table_name = crate::schema::users)]
struct UserChangeset {
    name: String,
    description: String,
    url: String,
    avatar_url: Option<String>,
    banner_url: Option<String>,
    updated_at: Option<DateTime<Utc>>,
}

#[patch("/update")]
async fn update_profile(
    db: web::Data<DbService>,
    req: HttpRequest,
    mut payload: Multipart,
) -> HttpResponse {
    let session_user_id = match require_session(&req).await {
        Some(id) => id,
        None => return HttpResponse::Unauthorized().finish(),
    };

    // Form fields
    let mut name = String::new();
    let mut description = String::new();
    let mut url = None;
    let mut remove_banner = false;
    let mut avatar_file_data = None;
    let mut avatar_file_type = None;
    let mut banner_file_data = None;
    let mut banner_file_type = None;

    // Read multipart fields
    while let Ok(Some(mut field)) = payload.try_next().await {
        let content_disposition = field.content_disposition().unwrap();
        let field_name = content_disposition.get_name().unwrap_or_default();

        match field_name {
            "name" => {
                while let Some(chunk) = field.next().await {
                    name = String::from_utf8_lossy(&chunk.unwrap()).to_string();
                }
            }
            "description" => {
                while let Some(chunk) = field.next().await {
                    description = String::from_utf8_lossy(&chunk.unwrap()).to_string();
                }
            }
            "url" => {
                while let Some(chunk) = field.next().await {
                    let val = String::from_utf8_lossy(&chunk.unwrap()).to_string();
                    url = Some(val);
                }
            }
            "removeBanner" => {
                while let Some(chunk) = field.next().await {
                    let data = chunk.unwrap();
                    let val = String::from_utf8_lossy(&data);
                    remove_banner = val.trim() == "true";
                }
            }
            "avatarFile" => {
                if let Ok((data, mime)) = read_file_data(field).await {
                    avatar_file_data = Some(data);
                    avatar_file_type = Some(mime);
                }
            }
            "bannerFile" => {
                if let Ok((data, mime)) = read_file_data(field).await {
                    banner_file_data = Some(data);
                    banner_file_type = Some(mime);
                }
            }
            _ => {
                // skip
                while field.next().await.is_some() {}
            }
        }
    }

    // Validate
    let form = UpdateProfileRequest {
        name: name.clone().into(),
        description: description.clone().into(),
        url: url.clone(),
        avatar_file: None,
        banner_file: None,
        remove_banner: Some(remove_banner),
    };

    if let Err(errors) = form.validate() {
        return HttpResponse::BadRequest().json(format!("Validation failed: {}", errors));
    }

    // Upload avatar
    let mut avatar_url = None;
    if let (Some(data), Some(mime)) = (avatar_file_data, avatar_file_type) {
        if let Err(e) = validate_file(&data, &mime, &FILE_VALIDATION_CONFIGS[0].1) {
            return HttpResponse::BadRequest().json(e);
        }
        match upload_file(&data, &mime).await {
            Ok(file) => avatar_url = Some(file.url),
            Err(e) => {
                return HttpResponse::InternalServerError()
                    .json(format!("Failed to upload avatar: {}", e));
            }
        }
    }

    // Upload banner
    let mut banner_url = None;
    if let (Some(data), Some(mime)) = (banner_file_data, banner_file_type) {
        if let Err(e) = validate_file(&data, &mime, &FILE_VALIDATION_CONFIGS[1].1) {
            return HttpResponse::BadRequest().json(e);
        }
        match upload_file(&data, &mime).await {
            Ok(file) => banner_url = Some(file.url),
            Err(e) => {
                return HttpResponse::InternalServerError()
                    .json(format!("Failed to upload banner: {}", e));
            }
        }
    }

    // Usuwanie bannera (ustaw pusty string)
    if remove_banner {
        banner_url = Some(String::new());
    }

    let changeset = UserChangeset {
        name,
        description,
        url: url.unwrap_or_else(|| "".to_string()),
        avatar_url,
        banner_url,
        updated_at: Some(Utc::now()),
    };

    let mut conn = db.get_conn();

    match diesel::update(users::users.filter(users::id.eq(session_user_id)))
        .set(changeset)
        .returning(CurrentUserSelect::as_returning())
        .get_result::<CurrentUserSelect>(&mut conn)
    {
        Ok(user) => HttpResponse::Ok().json(user),
        Err(e) => {
            HttpResponse::InternalServerError().json(format!("Failed to update profile: {}", e))
        }
    }
}
