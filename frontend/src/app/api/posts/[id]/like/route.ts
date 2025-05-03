import { db } from '@/db/db';
import { postLikesTable } from '@/db/schema';
import { handleApiError } from '@/db/utils/api';
import { withAuth } from '@/db/utils/auth';
import { NextResponse } from 'next/server';

export type LikePostParams = {
  id: string;
};

export type LikePostResponse = {
  id: string;
  message: string;
};

export const POST = withAuth(
  async (_request, userId: string, { params }: { params: Promise<LikePostParams> }) => {
    try {
      const { id } = await params;

      await db.insert(postLikesTable).values({
        postId: id,
        userId,
      });

      return NextResponse.json<LikePostResponse>({ id, message: 'Post liked successfully' });
    } catch (error) {
      return handleApiError(error);
    }
  }
);
