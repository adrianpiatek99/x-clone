import { db } from '@/db/db';
import { usersTable } from '@/db/schema';

export const getUsers = async () => {
  const users = await db.select({ id: usersTable.id }).from(usersTable);

  return users;
};
