use crate::schema::sql_types::PostMediaType as PostMediaTypeSql;
use diesel::FromSqlRow;
use diesel::deserialize::{self, FromSql};
use diesel::expression::AsExpression;
use diesel::pg::Pg;
use diesel::serialize::{self, IsNull, Output, ToSql};
use serde::{Deserialize, Serialize};
use std::io::Write;
use ts_rs::TS;

#[derive(
    Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, AsExpression, FromSqlRow, TS,
)]
#[ts(export, export_to = "../../frontend/src/types/enums.ts")]
#[diesel(sql_type = PostMediaTypeSql)]
pub enum PostMediaType {
    #[serde(rename = "PHOTO")]
    Photo,
    #[serde(rename = "VIDEO")]
    Video,
}

impl ToSql<PostMediaTypeSql, Pg> for PostMediaType {
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> serialize::Result {
        let val = match self {
            PostMediaType::Photo => "PHOTO",
            PostMediaType::Video => "VIDEO",
        };
        out.write_all(val.as_bytes())?;
        Ok(IsNull::No)
    }
}

impl FromSql<PostMediaTypeSql, Pg> for PostMediaType {
    fn from_sql(bytes: diesel::pg::PgValue<'_>) -> deserialize::Result<Self> {
        match bytes.as_bytes() {
            b"PHOTO" => Ok(PostMediaType::Photo),
            b"VIDEO" => Ok(PostMediaType::Video),
            _ => Err("Unrecognized enum variant for PostMediaType".into()),
        }
    }
}
