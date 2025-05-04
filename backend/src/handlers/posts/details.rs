use actix_web::{get, web, HttpRequest, HttpResponse, Responder};
use diesel::{QueryDsl, RunQueryDsl, ExpressionMethods};
use diesel::prelude::*;

use crate::db_service::DbService;
use crate::handlers::middleware::get_user_id_from_token;
use crate::schema::posts::dsl as posts;
use crate::schema::post_media::dsl as post_media;
use crate::schema::users::dsl as users;
use crate::models::post::*;
use crate::models::user::*;

#[get("/posts/{post_id}")]
async fn post_details(db: web::Data<DbService>, path: web::Path<String>, req: HttpRequest) -> impl Responder {
    let current_user_id = match get_user_id_from_token(&req).await {
        Ok(id) => Some(id),
        Err(_) => None,
    };
    let mut conn = db.get_conn();
    let pid_str = path.into_inner();

    let pid = match uuid::Uuid::parse_str(&pid_str) {
        Ok(uuid) => uuid,
        Err(_) => return HttpResponse::BadRequest().body("Invalid UUID format"),
    };

    let result = posts::posts
        .inner_join(users::users)
        .select((PostSchema::as_select(), User::as_select()))
        .filter(posts::id.eq(pid))
        .first::<(PostSchema, User)>(&mut conn);

    match result {
        Ok((post_schema, author)) => {
            let media = post_media::post_media
                .filter(post_media::post_id.eq(post_schema.id))
                .load::<PostMedia>(&mut conn)
                .expect("Error loading media");

            let response = Post {
                post: post_schema,
                author: author.clone(),
                media: media.clone(),
                is_author: current_user_id.map_or(false, |id| id == author.id),
                is_liked: false,
                likes_count: 0,
                replies_count: 0,
                edited_at: None,
            };

            HttpResponse::Ok().json(response)
        },
        Err(diesel::result::Error::NotFound) => HttpResponse::NotFound().body("Post not found"),
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            HttpResponse::InternalServerError().body("Internal server error")
        }
    }
}
