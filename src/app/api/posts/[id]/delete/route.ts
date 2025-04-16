import { db } from '@/db/db';
import { postsTable } from '@/db/schema/posts/table';
import { ApiError, handleApiError } from '@/db/utils/api';
import { withAuth } from '@/db/utils/auth';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export type DeletePostParams = { id: string };

export type DeletePostResponse = {
  id: string;
  message: string;
};

export const DELETE = withAuth(
  async (_request, userId: string, { params }: { params: Promise<DeletePostParams> }) => {
    try {
      const { id } = await params;

      const [post] = await db.select().from(postsTable).where(eq(postsTable.id, id));

      if (!post) {
        throw new ApiError('Post not found', 404);
      }

      if (post.authorId !== userId) {
        throw new ApiError('Unauthorized', 403);
      }

      await db.delete(postsTable).where(eq(postsTable.id, id));

      return NextResponse.json<DeletePostResponse>(
        { id, message: 'Post deleted' },
        { status: 200 }
      );
    } catch (error) {
      return handleApiError(error);
    }
  }
);
