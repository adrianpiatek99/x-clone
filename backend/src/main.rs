mod db_service;
mod schema;
mod models;
mod enums;
mod handlers;
mod helpers;

use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use db_service::DbService;
use env_logger::Env;



#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Initialize logger
    env_logger::init_from_env(Env::default().default_filter_or("info"));

    // Create database connection pool
    let db = web::Data::new(DbService::new());

    // Start HTTP server
    HttpServer::new(move || {
        // Configure CORS
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .supports_credentials();

        App::new()
            .wrap(cors)
            .app_data(db.clone())
            .configure(handlers::config)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
