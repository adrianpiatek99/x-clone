import { relations } from 'drizzle-orm';
import { integer, pgTable, text, unique, uuid } from 'drizzle-orm/pg-core';

import { createdAt, id, updatedAt } from '../helpers';
import { usersTable } from '../users/table';
import { ConversationControl, ConversationControlEnum, PostMediaTypeEnum } from './types';

export const postsTable = pgTable('posts', {
  id,
  text: text().notNull(),
  authorId: uuid('author_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  hashtags: text().notNull().array().default([]),
  conversationControl: ConversationControlEnum().notNull().default(ConversationControl.ALL),
  createdAt,
  updatedAt,
});

export const postMediaTable = pgTable('post_media', {
  id,
  url: text().notNull(),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  type: PostMediaTypeEnum().notNull(),
  postId: uuid('post_id')
    .notNull()
    .references(() => postsTable.id, { onDelete: 'cascade' }),
});

export const postLikesTable = pgTable(
  'post_likes',
  {
    id,
    postId: uuid('post_id')
      .notNull()
      .references(() => postsTable.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => usersTable.id),
    createdAt,
  },
  (t) => [unique().on(t.postId, t.userId)]
);

export const postRepliesTable = pgTable('post_reply', {
  id,
  authorId: uuid('author_id')
    .notNull()
    .references(() => usersTable.id),
  postId: uuid('post_id')
    .notNull()
    .references(() => postsTable.id, { onDelete: 'cascade' }),
  text: text().notNull(),
  createdAt,
  updatedAt,
});

// Relations
export const postRelations = relations(postsTable, ({ one, many }) => ({
  author: one(usersTable, {
    fields: [postsTable.authorId],
    references: [usersTable.id],
  }),
  likes: many(postLikesTable),
  media: many(postMediaTable),
  replies: many(postRepliesTable),
}));

export const postMediaRelations = relations(postMediaTable, ({ one }) => ({
  post: one(postsTable, {
    fields: [postMediaTable.postId],
    references: [postsTable.id],
  }),
}));

export const postLikesRelations = relations(postLikesTable, ({ one }) => ({
  post: one(postsTable, {
    fields: [postLikesTable.postId],
    references: [postsTable.id],
  }),
  user: one(usersTable, {
    fields: [postLikesTable.userId],
    references: [usersTable.id],
  }),
}));

export const postRepliesRelations = relations(postRepliesTable, ({ one }) => ({
  post: one(postsTable, {
    fields: [postRepliesTable.postId],
    references: [postsTable.id],
  }),
  author: one(usersTable, {
    fields: [postRepliesTable.authorId],
    references: [usersTable.id],
  }),
}));
