// @generated automatically by Diesel CLI.

pub mod sql_types {
    #[derive(diesel::query_builder::QueryId, diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "conversationControl"))]
    pub struct ConversationControl;

    #[derive(diesel::query_builder::QueryId, Clone, diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "post_media_type"))]
    pub struct PostMediaType;

    #[derive(diesel::query_builder::QueryId, Clone, diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "role"))]
    pub struct Role;
}

diesel::table! {
    post_edit_history (id) {
        id -> Uuid,
        post_id -> Uuid,
        previous_text -> Text,
        edited_at -> Timestamptz,
    }
}

diesel::table! {
    post_likes (id) {
        id -> Uuid,
        post_id -> Uuid,
        user_id -> Uuid,
        created_at -> Timestamptz,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::PostMediaType;

    post_media (id) {
        id -> Uuid,
        url -> Text,
        width -> Int4,
        height -> Int4,
        #[sql_name = "type"]
        type_ -> PostMediaType,
        post_id -> Uuid,
        user_id -> Uuid,
        created_at -> Timestamptz,
    }
}

diesel::table! {
    post_reply (id) {
        id -> Uuid,
        author_id -> Uuid,
        post_id -> Uuid,
        text -> Text,
        created_at -> Timestamptz,
        updated_at -> Timestamptz,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::ConversationControl;

    posts (id) {
        id -> Uuid,
        text -> Text,
        author_id -> Uuid,
        hashtags -> Nullable<Array<Nullable<Text>>>,
        conversationControl -> ConversationControl,
        created_at -> Timestamptz,
        updated_at -> Timestamptz,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::Role;

    users (id) {
        id -> Uuid,
        name -> Text,
        screen_name -> Text,
        email -> Text,
        password -> Text,
        avatar_url -> Text,
        banner_url -> Text,
        description -> Text,
        url -> Nullable<Text>,
        role -> Role,
        is_verified -> Bool,
        verified_at -> Nullable<Timestamptz>,
        created_at -> Timestamptz,
        updated_at -> Timestamptz,
    }
}

diesel::joinable!(post_edit_history -> posts (post_id));
diesel::joinable!(post_likes -> posts (post_id));
diesel::joinable!(post_likes -> users (user_id));
diesel::joinable!(post_media -> posts (post_id));
diesel::joinable!(post_media -> users (user_id));
diesel::joinable!(post_reply -> posts (post_id));
diesel::joinable!(post_reply -> users (author_id));
diesel::joinable!(posts -> users (author_id));

diesel::allow_tables_to_appear_in_same_query!(
    post_edit_history,
    post_likes,
    post_media,
    post_reply,
    posts,
    users,
);
