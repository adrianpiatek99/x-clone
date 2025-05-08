use futures::{StreamExt};
use reqwest::multipart::{Form, Part};
use serde::Serialize;

// const API_CLOUDINARY_KEY: &str = "dyvjyekzy";
const API_CLOUDINARY_URL: &str = "https://api.cloudinary.com/v1_1/dyvjyekzy/image/upload";
const UPLOAD_PRESET: &str = "maf4fhgi";

const IMAGE_FILE_TYPES: [&str; 4] = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
// const GIF_FILE_TYPES: [&str; 1] = ["image/gif"];
const BANNER_FILE_TYPES: [&str; 5] = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/gif"];

#[derive(Debug, Serialize)]
pub struct UploadFileOutput {
    pub url: String,
    pub width: i32,
    pub height: i32,
}

pub struct FileValidationConfig {
    pub field_name: &'static str,
    pub max_size_mb: u64,
    pub accept: &'static [&'static str],
}

pub const FILE_VALIDATION_CONFIGS: [(&str, FileValidationConfig); 2] = [
    (
        "avatar",
        FileValidationConfig {
            field_name: "avatar",
            max_size_mb: 1,
            accept: &IMAGE_FILE_TYPES,
        },
    ),
    (
        "banner",
        FileValidationConfig {
            field_name: "banner",
            max_size_mb: 2,
            accept: &BANNER_FILE_TYPES,
        },
    ),
];

pub fn validate_file(file_data: &[u8], file_type: &str, config: &FileValidationConfig) -> Result<(), String> {
    let max_size = config.max_size_mb * 1024 * 1024;

    if !config.accept.contains(&file_type) {
        return Err(format!(
            "Invalid {} format. File must be {}",
            config.field_name,
            config.accept.join(", ")
        ));
    }

    if file_data.len() > max_size as usize {
        return Err(format!(
            "Invalid {} size. File must be under {}MB",
            config.field_name,
            config.max_size_mb
        ));
    }

    Ok(())
}

pub async fn upload_file(file_data: &[u8], file_type: &str) -> Result<UploadFileOutput, String> {
    let client = reqwest::Client::new();

    let form = Form::new()
        .part("file", Part::bytes(file_data.to_vec()).file_name("file"))
        .text("upload_preset", UPLOAD_PRESET.to_string());

    let response = client
        .post(API_CLOUDINARY_URL)
        .multipart(form)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let data = response
        .json::<serde_json::Value>()
        .await
        .map_err(|e| e.to_string())?;

    if let Some(error) = data.get("error") {
        return Err(error.to_string());
    }

    Ok(UploadFileOutput {
        url: data["secure_url"].as_str().unwrap_or_default().to_string(),
        width: data["width"].as_i64().unwrap_or(0) as i32,
        height: data["height"].as_i64().unwrap_or(0) as i32,
    })
}

pub async fn read_file_data(mut field: actix_multipart::Field) -> Result<(Vec<u8>, String), String> {
    let mut file_data = Vec::new();
    let file_type = field.content_type().unwrap().to_string();

    while let Some(chunk) = field.next().await {
        let data = chunk.map_err(|e| e.to_string())?;
        file_data.extend_from_slice(&data);
    }

    if file_data.is_empty() {
        return Err("No file data found".to_string());
    }

    Ok((file_data, file_type))
}