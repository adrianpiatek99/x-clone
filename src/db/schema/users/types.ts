import { pgEnum } from 'drizzle-orm/pg-core';

import { enumToPgEnum } from '../helpers';
import type { usersTable } from './table';

// Enums
export enum UserRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  USER = 'USER',
}

export const UserRoleEnum = pgEnum('role', enumToPgEnum(UserRole));

// Types
type InterUser = typeof usersTable.$inferSelect;

export type User = Omit<InterUser, 'password'>;

export type UserProfile = Pick<
  User,
  | 'id'
  | 'name'
  | 'screenName'
  | 'description'
  | 'profileImageUrl'
  | 'profileBannerUrl'
  | 'isVerified'
  | 'createdAt'
>;
