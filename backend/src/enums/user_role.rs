use crate::schema::sql_types::Role as RoleSql;
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
#[diesel(sql_type = RoleSql)]
pub enum Role {
    ADMIN,
    MODERATOR,
    USER,
}

impl ToSql<RoleSql, Pg> for Role {
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> serialize::Result {
        let val = match self {
            Role::ADMIN => "ADMIN",
            Role::MODERATOR => "MODERATOR",
            Role::USER => "USER",
        };
        out.write_all(val.as_bytes())?;
        Ok(IsNull::No)
    }
}

impl FromSql<RoleSql, Pg> for Role {
    fn from_sql(bytes: diesel::pg::PgValue<'_>) -> deserialize::Result<Self> {
        match bytes.as_bytes() {
            b"ADMIN" => Ok(Role::ADMIN),
            b"MODERATOR" => Ok(Role::MODERATOR),
            b"USER" => Ok(Role::USER),
            _ => Err("Unrecognized enum variant for Role".into()),
        }
    }
}
