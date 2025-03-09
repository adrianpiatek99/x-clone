import { compare } from 'bcryptjs';
import { eq, ilike, or } from 'drizzle-orm';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { db } from './db/db';
import { usersSelect, usersTable } from './db/schema';
import { signInSchema } from './schemas';
import { ApiError } from './utils/api';

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
        }

        try {
          const [dbUser] = await db
            .select(usersSelect)
            .from(usersTable)
            .where(eq(usersTable.id, user.id));

          if (!dbUser) {
            return { ...session, user: undefined };
          }

          Object.assign(user, dbUser);

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          return { ...session, user: undefined };
        }
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return null;

      const [dbUser] = await db
        .select(usersSelect)
        .from(usersTable)
        .where(eq(usersTable.id, token.sub));

      if (!dbUser) {
        return null;
      }

      return token;
    },
  },
});
