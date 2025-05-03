use diesel::pg::Pg;
use diesel::deserialize::{self, FromSql};
use diesel::serialize::{self, ToSql, Output, IsNull};
use diesel::expression::AsExpression;
use diesel::FromSqlRow;
use std::io::Write;
use crate::schema::sql_types::Role as RoleSql;
use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, AsExpression, FromSqlRow)]
#[diesel(sql_type = RoleSql)]
pub enum Role {
    #[serde(rename = "ADMIN")]
    Admin,
    #[serde(rename = "MODERATOR")]
    Moderator,
    #[serde(rename = "USER")]
    User,
}

impl ToSql<RoleSql, Pg> for Role {
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> serialize::Result {
        let val = match self {
            Role::Admin => "ADMIN",
            Role::Moderator => "MODERATOR",
            Role::User => "USER",
        };
        out.write_all(val.as_bytes())?;
        Ok(IsNull::No)
    }
}

impl FromSql<RoleSql, Pg> for Role {
    fn from_sql(bytes: diesel::pg::PgValue<'_>) -> deserialize::Result<Self> {
        match bytes.as_bytes() {
            b"ADMIN" => Ok(Role::Admin),
            b"MODERATOR" => Ok(Role::Moderator),
            b"USER" => Ok(Role::User),
            _ => Err("Unrecognized enum variant for Role".into()),
        }
    }
}