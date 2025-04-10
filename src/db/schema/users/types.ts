import { pgEnum } from 'drizzle-orm/pg-core';

import { enumToPgEnum } from '../helpers';
import type { usersTable } from './table';

export enum UserRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  USER = 'USER',
}

export const UserRoleEnum = pgEnum('role', enumToPgEnum(UserRole));

type InterUser = typeof usersTable.$inferSelect;

export type User = Omit<InterUser, 'password'>;
