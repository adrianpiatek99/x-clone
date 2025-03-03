import { pgEnum, pgTable, text } from 'drizzle-orm/pg-core';

import { createdAt, id, updatedAt } from '../schemaHelpers';

export const UserRole = pgEnum('roles', ['ADMIN', 'MODERATOR', 'USER']);

type InterUser = typeof usersTable.$inferSelect;

export type User = Omit<InterUser, 'password' | 'emailVerified'>;

export const usersTable = pgTable('users', {
  id,
  name: text().notNull(),
  screenName: text('screen_name').notNull().unique(),
  email: text().notNull().unique(),
  password: text().notNull(),
  profileImageUrl: text('profile_image_url').notNull().default(''),
  profileBannerUrl: text('profile_banner_url').notNull().default(''),
  description: text().notNull().default(''),
  url: text(),
  role: UserRole().notNull().default('USER'),
  createdAt,
  updatedAt,
});
