-- This file should undo anything in `up.sql`

DROP TABLE IF EXISTS follows;
DROP TABLE IF EXISTS post_edit_history;
DROP TABLE IF EXISTS post_likes;
DROP TABLE IF EXISTS post_media;
DROP TABLE IF EXISTS post_replies;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;

DROP TYPE IF EXISTS "conversationControl";
DROP TYPE IF EXISTS "postMediaType";
DROP TYPE IF EXISTS "role";
