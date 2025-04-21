import { compare } from 'bcryptjs';
import { eq, ilike, or } from 'drizzle-orm';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { db } from './db/db';
import { currentUserColumns, usersTable } from './db/schema';
import { ApiError } from './db/utils/api';
import { signInSchema } from './schema/auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        emailOrScreenName: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          const { emailOrScreenName, password } = signInSchema().parse(credentials);

          const user = await db
            .select()
            .from(usersTable)
            .where(
              or(
                eq(usersTable.email, emailOrScreenName),
                ilike(usersTable.screenName, emailOrScreenName)
              )
            )
            .then((res) => res[0]);

          if (!user) return null;

          const isPasswordMatch = await compare(password, user.password);

          if (!user || !isPasswordMatch) {
            throw new ApiError('Invalid credentials.', 403);
          }

          return user;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (session.user) {
        const { user } = session;

        if (token.sub) {
          user.id = token.sub;

          const currentUser = await db.query.usersTable.findFirst({
            where: eq(usersTable.id, user.id),
            columns: currentUserColumns,
          });

          if (currentUser) {
            Object.assign(user, currentUser);
          }
        }

        return session;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return null;

      return token;
    },
  },
});
