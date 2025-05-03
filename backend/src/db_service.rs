use diesel::{r2d2::ConnectionManager, PgConnection};
use r2d2::Pool;
use dotenv::dotenv;
use std::env;

pub type DBPool = Pool<ConnectionManager<PgConnection>>;

pub struct DbService {
    pool: DBPool,
}

impl DbService {
    pub fn new() -> Self {
        Self {
            pool: create_db_pool(),
        }
    }

    pub fn get_conn(&self) -> r2d2::PooledConnection<ConnectionManager<PgConnection>> {
        self.pool.get().expect("Failed to get connection from pool")
    }
}

pub fn create_db_pool() -> DBPool {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set in .env file");

    let manager = ConnectionManager::<PgConnection>::new(database_url);

    Pool::builder()
        .build(manager)
        .expect("Failed to create database pool")
}

#[cfg(test)]
mod tests {
    use super::*;
    use diesel::sql_query;
    use diesel::RunQueryDsl;

    #[test]
    fn test_db_connection() {
        let pool = create_db_pool();
        let mut conn = pool.get().expect("Failed to get connection from pool");

        // Execute a simple query to verify connection
        let result = sql_query("SELECT 1")
            .execute(&mut conn)
            .expect("Failed to execute query");

        assert_eq!(result, 1, "Database connection test failed");
    }
}


