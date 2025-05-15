use crate::schema::sql_types::ConversationControl as ConversationControlSql;
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
#[diesel(sql_type = ConversationControlSql)]
pub enum ConversationControl {
    ALL,
    COMMUNITY,
    BY_INVITATION,
}

impl ToSql<ConversationControlSql, Pg> for ConversationControl {
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> serialize::Result {
        let val = match self {
            ConversationControl::ALL => "ALL",
            ConversationControl::COMMUNITY => "COMMUNITY",
            ConversationControl::BY_INVITATION => "BY_INVITATION",
        };
        out.write_all(val.as_bytes())?;
        Ok(IsNull::No)
    }
}

impl FromSql<ConversationControlSql, Pg> for ConversationControl {
    fn from_sql(bytes: diesel::pg::PgValue<'_>) -> deserialize::Result<Self> {
        match bytes.as_bytes() {
            b"ALL" => Ok(ConversationControl::ALL),
            b"COMMUNITY" => Ok(ConversationControl::COMMUNITY),
            b"BY_INVITATION" => Ok(ConversationControl::BY_INVITATION),
            _ => Err("Unrecognized enum variant for ConversationControl".into()),
        }
    }
}
