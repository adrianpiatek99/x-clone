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
import { and, desc, eq, lt, or } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export type GlobalPostsTimelineResponse = {
  posts: Post[];
  nextCursor: { id: string; createdAt: string } | null;
};

export type GlobalPostsTimelineParams = {
  cursor?: {
    id: string;
    createdAt: Date;
  };
  limit?: number;
};

export const GET = async (request: NextRequest) => {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);

    const userId = session?.user?.id;
    const cursorStr = searchParams.get('cursor');
    const cursor: GlobalPostsTimelineParams['cursor'] = cursorStr
      ? {
          ...JSON.parse(cursorStr),
          createdAt: new Date(JSON.parse(cursorStr).createdAt),
        }
      : undefined;
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const take = limit + 1;

    const posts = await db.query.postsTable.findMany({
      limit: take,
      where: cursor
        ? or(
            lt(postsTable.createdAt, cursor.createdAt),
            and(eq(postsTable.createdAt, cursor.createdAt), lt(postsTable.id, cursor.id))
          )
        : undefined,
      orderBy: [desc(postsTable.createdAt), desc(postsTable.id)],
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

    let nextCursor: GlobalPostsTimelineResponse['nextCursor'] = null;

    if (posts.length > limit) {
      posts.pop();

      const nextItem = posts[posts.length - 1];

      if (nextItem) {
        nextCursor = {
          id: nextItem.id,
          createdAt: nextItem.createdAt.toISOString(),
        };
      }
    }

    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
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

    return NextResponse.json<GlobalPostsTimelineResponse>({
      posts: postsWithCounts,
      nextCursor,
    });
  } catch (error) {
    return handleApiError(error);
  }
};
