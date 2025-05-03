use diesel::pg::Pg;
use diesel::deserialize::{self, FromSql};
use diesel::serialize::{self, ToSql, Output, IsNull};
use diesel::expression::AsExpression;
use diesel::FromSqlRow;
use std::io::Write;
use crate::schema::sql_types::PostMediaType as PostMediaTypeSql;
use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, AsExpression, FromSqlRow)]
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