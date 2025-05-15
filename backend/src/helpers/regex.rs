use regex::Regex;

lazy_static::lazy_static! {
  pub static ref SCREEN_NAME_REGEX: Regex = Regex::new(r"^[a-zA-Z0-9][a-zA-Z0-9_]*$").unwrap();
  pub static ref NAME_REGEX: Regex = Regex::new(r"^[\p{L}0-9]+(?:[\s-][\p{L}0-9]+)*$").unwrap();
  pub static ref EMAIL_REGEX: Regex = Regex::new(r"^[^\s@]+@[^\s@]+\.[^\s@]+$").unwrap();
}
