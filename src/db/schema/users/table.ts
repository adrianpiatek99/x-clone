import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { createdAt, id, updatedAt } from '../helpers';
import type { User, UserPublic } from './types';
import { UserRole, UserRoleEnum } from './types';

export const usersTable = pgTable('users', {
  id,
  name: text().notNull(),
  screenName: text('screen_name').notNull().unique(),
  email: text().notNull().unique(),
  password: text().notNull(),
  avatarUrl: text('avatar_url').notNull().default(''),
  bannerUrl: text('banner_url').notNull().default(''),
  description: text().notNull().default(''),
  url: text(),
  role: UserRoleEnum().notNull().default(UserRole.USER),
  isVerified: boolean('is_verified').notNull().default(false),
  verifiedAt: timestamp('verified_at', { withTimezone: true }),
  createdAt,
  updatedAt,
});

// Columns
export const currentUserColumns = {
  id: true,
  name: true,
  screenName: true,
  email: true,
  avatarUrl: true,
  bannerUrl: true,
  description: true,
  url: true,
  role: true,
  isVerified: true,
  verifiedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Record<keyof User, boolean>;

export const userPublicColumns = {
  id: true,
  name: true,
  screenName: true,
  description: true,
  avatarUrl: true,
  bannerUrl: true,
  url: true,
  role: true,
  isVerified: true,
  verifiedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Record<keyof UserPublic, boolean>;
