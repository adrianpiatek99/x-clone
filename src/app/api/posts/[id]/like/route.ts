import { db } from '@/db/db';
import { postLikesTable } from '@/db/schema';
import { ApiError, handleApiError } from '@/db/utils/api';
import { withAuth } from '@/db/utils/auth';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export type LikePostRequest = {
  id: string;
};

export type LikePostResponse = {
  id: string;
  message: string;
};

export const GET = withAuth(
  async (_request, userId: string, { params }: { params: Promise<LikePostRequest> }) => {
    try {
      const { id } = await params;

      const [existingLike] = await db
        .select()
        .from(postLikesTable)
        .where(and(eq(postLikesTable.postId, id), eq(postLikesTable.userId, userId)));

      if (existingLike) {
        throw new ApiError('Post already liked', 400);
      }

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
