import { auth } from '@/auth';
import { type NextRequest } from 'next/server';

import { ApiError } from './api';

export type AuthenticatedHandler = (req: NextRequest, userId: string) => Promise<Response>;

export const withAuth = (handler: AuthenticatedHandler) => async (req: NextRequest) => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new ApiError('Unauthorized', 401);
  }

  return handler(req, session.user.id);
};
