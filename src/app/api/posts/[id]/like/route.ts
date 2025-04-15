import { db } from '@/db/db';
import { postLikesTable } from '@/db/schema';
import { handleApiError } from '@/db/utils/api';
import { withAuth } from '@/db/utils/auth';
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
