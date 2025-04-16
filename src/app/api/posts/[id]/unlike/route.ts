import { db } from '@/db/db';
import { postLikesTable } from '@/db/schema';
import { ApiError, handleApiError } from '@/db/utils/api';
import { withAuth } from '@/db/utils/auth';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export type UnlikePostRequest = {
  id: string;
};

export type UnlikePostResponse = {
  id: string;
  message: string;
};

export const DELETE = withAuth(
  async (_request, userId: string, { params }: { params: Promise<UnlikePostRequest> }) => {
    try {
      const { id } = await params;

      const result = await db
        .delete(postLikesTable)
        .where(and(eq(postLikesTable.postId, id), eq(postLikesTable.userId, userId)))
        .returning();

      if (!result.length) {
        throw new ApiError('Post not liked', 400);
      }

      return NextResponse.json<UnlikePostResponse>({ id, message: 'Post unliked successfully' });
    } catch (error) {
      return handleApiError(error);
    }
  }
);
