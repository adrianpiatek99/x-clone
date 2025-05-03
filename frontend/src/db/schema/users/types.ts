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

export type User = Omit<InterUser, 'password'> & {
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
};

export type UserPublic = Pick<
  User,
  | 'id'
  | 'name'
  | 'screenName'
  | 'description'
  | 'avatarUrl'
  | 'bannerUrl'
  | 'url'
  | 'role'
  | 'isVerified'
  | 'verifiedAt'
  | 'createdAt'
  | 'updatedAt'
>;

export type UserProfile = UserPublic & {
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
};
