import { pgEnum } from 'drizzle-orm/pg-core';

import type { usersTable } from './table';

export const UserRole = pgEnum('roles', ['ADMIN', 'MODERATOR', 'USER']);

type InterUser = typeof usersTable.$inferSelect;

export type User = Omit<InterUser, 'password'>;
