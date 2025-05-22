use validator::ValidationError;

use super::regex::{NAME_REGEX, SCREEN_NAME_REGEX};

pub const MAX_POST_TEXT_LENGTH: usize = 500;
pub const MAX_POST_REPLY_TEXT_LENGTH: usize = 400;
pub const MIN_NAME_LENGTH: usize = 4;
pub const MAX_NAME_LENGTH: usize = 50;
pub const MIN_SCREEN_NAME_LENGTH: usize = 4;
pub const MAX_SCREEN_NAME_LENGTH: usize = 15;
pub const MAX_EMAIL_LENGTH: usize = 100;
pub const MIN_PASSWORD_LENGTH: usize = 6;
pub const MAX_PASSWORD_LENGTH: usize = 32;
pub const MAX_DESCRIPTION_LENGTH: usize = 160;

pub fn validate_name(name: &str) -> Result<(), ValidationError> {
    let char_count = name.chars().count();

    if char_count < MIN_NAME_LENGTH || char_count > MAX_NAME_LENGTH {
        let mut err = ValidationError::new("length");
        err.message = Some(
            format!(
                "Name must be between {} and {} characters",
                MIN_NAME_LENGTH, MAX_NAME_LENGTH
            )
            .into(),
        );
        return Err(err);
    }

    if !NAME_REGEX.is_match(name) {
        let mut err = ValidationError::new("regex");
        err.message = Some("Name contains invalid characters".into());
        return Err(err);
    }

    Ok(())
}

pub fn validate_screen_name(name: &str) -> Result<(), ValidationError> {
    let char_count = name.chars().count();

    if char_count < MIN_SCREEN_NAME_LENGTH || char_count > MAX_SCREEN_NAME_LENGTH {
        let mut err = ValidationError::new("length");
        err.message = Some(
            format!(
                "Screen name must be between {} and {} characters",
                MIN_SCREEN_NAME_LENGTH, MAX_SCREEN_NAME_LENGTH
            )
            .into(),
        );
        return Err(err);
    }

    if !SCREEN_NAME_REGEX.is_match(name) {
        let mut err = ValidationError::new("regex");
        err.message = Some("Screen name must start with a letter or number and can only contain letters, numbers, and underscores".into());
        return Err(err);
    }

    Ok(())
}

pub fn validate_email(email: &str) -> Result<(), ValidationError> {
    let char_count = email.chars().count();

    if char_count > MAX_EMAIL_LENGTH {
        let mut err = ValidationError::new("length");
        err.message =
            Some(format!("Email must be less than {} characters", MAX_EMAIL_LENGTH).into());
        return Err(err);
    }

    Ok(())
}

pub fn validate_password(password: &str) -> Result<(), ValidationError> {
    let char_count = password.chars().count();

    if char_count < MIN_PASSWORD_LENGTH || char_count > MAX_PASSWORD_LENGTH {
        let mut err = ValidationError::new("length");
        err.message = Some(
            format!(
                "Password must be between {} and {} characters",
                MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH
            )
            .into(),
        );
        return Err(err);
    }

    Ok(())
}

pub fn validate_description(desc: &str) -> Result<(), ValidationError> {
    let trimmed_desc = desc
        .trim()
        .replace(|c: char| c == '\n', "")
        .replace(|c: char| c.is_whitespace(), " ");
    let char_count = trimmed_desc.chars().count();

    if char_count > MAX_DESCRIPTION_LENGTH {
        let mut err = ValidationError::new("length");
        err.message = Some(
            format!(
                "Description must be less than {} characters",
                MAX_DESCRIPTION_LENGTH
            )
            .into(),
        );
        return Err(err);
    }

    Ok(())
}

pub fn validate_post_text(text: &str) -> Result<(), ValidationError> {
    let trimmed_text = text
        .trim()
        .replace(|c: char| c == '\n', "")
        .replace(|c: char| c.is_whitespace(), " ");
    let char_count = trimmed_text.chars().count();

    if trimmed_text.is_empty() {
        return Err(ValidationError::new("empty_text"));
    }
    if char_count > MAX_POST_TEXT_LENGTH {
        return Err(ValidationError::new("text_too_long"));
    }

    Ok(())
}

pub fn validate_post_reply_text(text: &str) -> Result<(), ValidationError> {
    let trimmed_text = text
        .trim()
        .replace(|c: char| c == '\n', "")
        .replace(|c: char| c.is_whitespace(), " ");
    let char_count = trimmed_text.chars().count();

    if trimmed_text.is_empty() {
        return Err(ValidationError::new("empty_text"));
    }
    if char_count > MAX_POST_REPLY_TEXT_LENGTH {
        return Err(ValidationError::new("text_too_long"));
    }

    Ok(())
}
