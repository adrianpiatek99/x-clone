use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use ts_rs::TS;
use uuid::Uuid;

// #[derive(Debug, Deserialize, TS)]
// #[serde(rename_all = "camelCase")]
// pub struct CursorParams {
//     pub cursor: Option<String>,
//     pub limit: Option<i64>,
// }

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../frontend/src/types/global.ts")]
#[serde(rename_all = "camelCase")]
pub struct Cursor {
    pub id: Uuid,
    pub created_at: DateTime<Utc>,
}