use validator::ValidationError;

use super::regex::{NAME_REGEX, SCREEN_NAME_REGEX};

pub const MAX_POST_TEXT_LENGTH: usize = 500;

pub fn validate_name(name: &str) -> Result<(), ValidationError> {
    if name.len() < 4 || name.len() > 50 {
        let mut err = ValidationError::new("length");
        err.message = Some("Name must be between 4 and 50 characters".into());
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
    if name.len() < 4 || name.len() > 15 {
        let mut err = ValidationError::new("length");
        err.message = Some("Screen name must be between 4 and 15 characters".into());
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
    if email.len() > 100 {
        let mut err = ValidationError::new("length");
        err.message = Some("Email must be less than 100 characters".into());
        return Err(err);
    }

    Ok(())
}

pub fn validate_password(password: &str) -> Result<(), ValidationError> {
    if password.len() < 6 || password.len() > 32 {
        let mut err = ValidationError::new("length");
        err.message = Some("Password must be between 6 and 32 characters".into());
        return Err(err);
    }

    Ok(())
}

pub fn validate_description(desc: &str) -> Result<(), ValidationError> {
    let char_count = desc.chars().count();
    if char_count > 160 {
        let mut err = ValidationError::new("length");
        err.message = Some("Description must be less than 160 characters".into());
        return Err(err);
    }

    Ok(())
}

pub fn validate_post_text(text: &str) -> Result<(), ValidationError> {
    let trimmed_text = text.trim().replace(|c: char| c.is_whitespace(), " ");
    if trimmed_text.is_empty() {
        return Err(ValidationError::new("empty_text"));
    }
    if trimmed_text.len() > MAX_POST_TEXT_LENGTH {
        return Err(ValidationError::new("text_too_long"));
    }
    Ok(())
}
