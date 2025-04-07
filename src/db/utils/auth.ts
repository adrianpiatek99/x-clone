import { auth } from '@/auth';
import type { NextRequest } from 'next/server';
import type { NextResponse } from 'next/server';

import { ApiError } from './api';

type AuthenticatedHandler = (req: NextRequest, userId: string) => Promise<NextResponse>;

export const withAuth = (handler: AuthenticatedHandler) => async (req: NextRequest) => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new ApiError('Unauthorized', 401);
  }

  return handler(req, session.user.id);
};
