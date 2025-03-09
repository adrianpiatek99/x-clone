import { pgEnum, pgTable, text } from 'drizzle-orm/pg-core';

import { createdAt, id, updatedAt } from '../schemaHelpers';

export const UserRole = pgEnum('roles', ['ADMIN', 'MODERATOR', 'USER']);

type InterUser = typeof usersTable.$inferSelect;

export type User = Omit<InterUser, 'password'>;

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

export const usersSelect = {
  id: usersTable.id,
  name: usersTable.name,
  screenName: usersTable.screenName,
  email: usersTable.email,
  profileImageUrl: usersTable.profileImageUrl,
  profileBannerUrl: usersTable.profileBannerUrl,
  description: usersTable.description,
  url: usersTable.url,
  role: usersTable.role,
  createdAt: usersTable.createdAt,
  updatedAt: usersTable.updatedAt,
} satisfies Record<keyof User, (typeof usersTable)[keyof typeof usersTable]>;
