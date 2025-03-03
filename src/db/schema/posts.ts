import { relations } from 'drizzle-orm';
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { createdAt, id, updatedAt } from '../schemaHelpers';
import { usersTable } from './users';

export const postsTable = pgTable('posts', {
  id,
  text: text().notNull(),
  authorId: uuid('author_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  hashtags: text().array(),
  createdAt,
  updatedAt,
});

export const postRelations = relations(postsTable, ({ one }) => ({
  author: one(usersTable, {
    fields: [postsTable.authorId],
    references: [usersTable.id],
  }),
}));
