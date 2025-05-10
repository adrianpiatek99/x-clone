use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

// #[derive(Debug, Deserialize, TS)]
// #[serde(rename_all = "camelCase")]
// pub struct CursorParams {
//     pub cursor: Option<String>,
//     pub limit: Option<i64>,
// }

#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../frontend/src/types/global.ts")]
pub struct Cursor {
    pub id: Uuid,
    pub created_at: DateTime<Utc>,
}
