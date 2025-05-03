import type { User } from '@/db/schema';
import type { DefaultSession } from 'next-auth';

type ExtendedUser = DefaultSession['user'] & User;

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: ExtendedUser;
  }
}
