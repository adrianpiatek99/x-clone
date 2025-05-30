DROP TABLE IF EXISTS follows;
DROP TABLE IF EXISTS post_edit_history;
DROP TABLE IF EXISTS post_likes;
DROP TABLE IF EXISTS post_media;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;

DROP TYPE IF EXISTS "conversationControl";
DROP TYPE IF EXISTS "postMediaType";
DROP TYPE IF EXISTS "role";

CREATE TYPE "conversationControl" AS ENUM ('ALL', 'COMMUNITY', 'BY_INVITATION');
CREATE TYPE "postMediaType" AS ENUM ('PHOTO', 'VIDEO');
CREATE TYPE "role" AS ENUM ('ADMIN', 'MODERATOR', 'USER');

CREATE TABLE users (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    screen_name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    avatar_url TEXT NOT NULL,
    banner_url TEXT NOT NULL,
    description TEXT NOT NULL,
    url TEXT,
    role role NOT NULL,
    is_verified BOOLEAN NOT NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE posts (
    id UUID PRIMARY KEY,
    text TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reply_to_post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    hashtags TEXT[],
    conversation_control "conversationControl" NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE post_media (
    id UUID PRIMARY KEY,
    url TEXT NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    type "postMediaType" NOT NULL,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE post_likes (
    id UUID PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT unique_post_like UNIQUE (post_id, user_id)
);

CREATE TABLE post_edit_history (
    id UUID PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    previous_text TEXT NOT NULL,
    edited_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE follows (
    id UUID PRIMARY KEY,
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT unique_follow UNIQUE (follower_id, following_id)
);
