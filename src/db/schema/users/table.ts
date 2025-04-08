import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { createdAt, id, updatedAt } from '../helpers';
import type { User } from './types';
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

// Select
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
  isVerified: usersTable.isVerified,
  verifiedAt: usersTable.verifiedAt,
  createdAt: usersTable.createdAt,
  updatedAt: usersTable.updatedAt,
} satisfies Record<keyof User, (typeof usersTable)[keyof typeof usersTable]>;
