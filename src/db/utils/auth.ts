import { auth } from '@/auth';
import type { NextRequest } from 'next/server';
import type { NextResponse } from 'next/server';

import { ApiError } from './api';

type AuthenticatedHandler<TParams> = (
  req: NextRequest,
  userId: string,
  { params }: { params: TParams }
) => Promise<NextResponse>;

export const withAuth =
  <TParams>(handler: AuthenticatedHandler<TParams>) =>
  async (req: NextRequest, { params }: { params: TParams }) => {
    const session = await auth();

    if (!session?.user?.id) {
      throw new ApiError('Unauthorized', 401);
    }

    return handler(req, session.user.id, { params });
  };
