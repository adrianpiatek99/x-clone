import { auth } from '@/auth';
import { db } from '@/db/db';
import type { Post } from '@/db/schema';
import {
  postAuthorColumns,
  postLikesTable,
  postRepliesTable,
  postsTable,
} from '@/db/schema/posts/table';
import { handleApiError } from '@/db/utils/api';
import { and, desc, eq, gt } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export type HomeLatestTimelineResponse = { posts: Post[]; nextCursor: string | null };

export type HomeLatestTimelineParams = { cursor?: string; limit?: number };

export const GET = async (request: NextRequest) => {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);

    const userId = session?.user?.id;
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const take = limit + 1;

    const posts = await db.query.postsTable.findMany({
      limit: take,
      orderBy: [desc(postsTable.createdAt)],
      where: cursor ? and(gt(postsTable.id, cursor)) : undefined,
      with: {
        author: {
          columns: postAuthorColumns,
        },
        likes: {
          where: userId ? eq(postLikesTable.userId, userId) : undefined,
          columns: {
            userId: true,
          },
        },
        media: true,
      },
    });

    let nextCursor: string | null = null;
    let postsToReturn = posts;

    if (posts.length > limit) {
      const nextItem = posts.pop();

      nextCursor = nextItem?.id || null;
      postsToReturn = posts;
    }

    const postsWithCounts = await Promise.all(
      postsToReturn.map(async (post) => {
        const [likesCount, repliesCount] = await Promise.all([
          db.$count(postLikesTable, eq(postLikesTable.postId, post.id)),
          db.$count(postRepliesTable, eq(postRepliesTable.postId, post.id)),
        ]);

        const isLiked = post.likes.length > 0;

        return {
          ...post,
          isLiked,
          likesCount,
          repliesCount,
        };
      })
    );

    return NextResponse.json<HomeLatestTimelineResponse>({
      posts: postsWithCounts,
      nextCursor,
    });
  } catch (error) {
    return handleApiError(error);
  }
};
