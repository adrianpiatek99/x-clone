use diesel::pg::Pg;
use diesel::deserialize::{self, FromSql};
use diesel::serialize::{self, ToSql, Output, IsNull};
use diesel::expression::AsExpression;
use diesel::FromSqlRow;
use std::io::Write;
use crate::schema::sql_types::ConversationControl as ConversationControlSql;
use serde::{Serialize, Deserialize};
use ts_rs::TS;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, AsExpression, FromSqlRow, TS)]
#[ts(export, export_to = "../../frontend/src/types/enums.ts")]
#[diesel(sql_type = ConversationControlSql)]
pub enum ConversationControl {
    #[serde(rename = "ALL")]
    All,
    #[serde(rename = "COMMUNITY")]
    Community,
    #[serde(rename = "BY_INVITATION")]
    ByInvitation,
}

impl ToSql<ConversationControlSql, Pg> for ConversationControl {
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> serialize::Result {
        let val = match self {
            ConversationControl::All => "ALL",
            ConversationControl::Community => "COMMUNITY",
            ConversationControl::ByInvitation => "BY_INVITATION",
        };
        out.write_all(val.as_bytes())?;
        Ok(IsNull::No)
    }
}

impl FromSql<ConversationControlSql, Pg> for ConversationControl {
    fn from_sql(bytes: diesel::pg::PgValue<'_>) -> deserialize::Result<Self> {
        match bytes.as_bytes() {
            b"ALL" => Ok(ConversationControl::All),
            b"COMMUNITY" => Ok(ConversationControl::Community),
            b"BY_INVITATION" => Ok(ConversationControl::ByInvitation),
            _ => Err("Unrecognized enum variant for ConversationControl".into()),
        }
    }
}