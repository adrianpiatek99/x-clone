import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { createdAt, id, updatedAt } from '../helpers';
import type { User, UserProfile } from './types';
import { UserRole, UserRoleEnum } from './types';

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
  profileImageUrl: true,
  profileBannerUrl: true,
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
  profileImageUrl: true,
  profileBannerUrl: true,
  isVerified: true,
  createdAt: true,
} satisfies Record<keyof UserProfile, boolean>;
