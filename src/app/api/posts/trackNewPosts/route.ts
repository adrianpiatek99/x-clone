import { db } from '@/db/db';
import { postsTable } from '@/db/schema/posts/table';
import { ApiError, handleApiError } from '@/db/utils/api';
import { eq, gt } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const trackingParamsSchema = z.object({
  latestPostId: z.string().uuid('Invalid post ID format'),
});

export type GetPostsTrackingParams = z.infer<typeof trackingParamsSchema>;

export type GetPostsTrackingResponse = {
  newPostsCount: number;
};

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    const { latestPostId } = trackingParamsSchema.parse(params);

    const referencePost = await db.query.postsTable.findFirst({
      where: eq(postsTable.id, latestPostId),
      columns: {
        createdAt: true,
      },
    });

    if (!referencePost) {
      throw new ApiError('Post not found', 404);
    }

    const newPosts = await db.query.postsTable.findMany({
      where: gt(postsTable.createdAt, referencePost.createdAt),
      columns: {
        id: true,
      },
    });

    const filteredNewPosts = newPosts.filter((post) => post.id !== latestPostId);

    return NextResponse.json<GetPostsTrackingResponse>({
      newPostsCount: filteredNewPosts.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
};
