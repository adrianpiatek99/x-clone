import { auth } from '@/auth';
import { db } from '@/db/db';
import type { Post } from '@/db/schema';
import { userPublicColumns } from '@/db/schema';
import {
  postEditHistoryTable,
  postLikesTable,
  postRepliesTable,
  postsTable,
} from '@/db/schema/posts/table';
import { handleApiError } from '@/db/utils/api';
import { and, desc, eq, lt, or } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export type GetGlobalTimelineParams = {
  cursor?: {
    id: string;
    createdAt: Date;
  };
  limit?: number;
};

export type GetGlobalTimelineResponse = {
  posts: Post[];
  nextCursor: { id: string; createdAt: string } | null;
};

export const GET = async (request: NextRequest) => {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const userId = session?.user?.id;

    // Validate cursor
    const cursorStr = searchParams.get('cursor');
    const cursor: GetGlobalTimelineParams['cursor'] = cursorStr
      ? {
          ...JSON.parse(cursorStr),
          createdAt: new Date(JSON.parse(cursorStr).createdAt),
        }
      : undefined;
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const take = limit + 1;

    // Fetch posts
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
          columns: userPublicColumns,
        },
        likes: {
          where: userId ? eq(postLikesTable.userId, userId) : undefined,
          columns: {
            userId: true,
          },
        },
        media: true,
        editHistory: {
          limit: 1,
          columns: {
            id: true,
            editedAt: true,
          },
          orderBy: [desc(postEditHistoryTable.editedAt)],
        },
      },
    });

    // Calculate next cursor
    let nextCursor: GetGlobalTimelineResponse['nextCursor'] = null;

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

    // Fetch counts and prepare response
    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const [likesCount, repliesCount] = await Promise.all([
          db.$count(postLikesTable, eq(postLikesTable.postId, post.id)),
          db.$count(postRepliesTable, eq(postRepliesTable.postId, post.id)),
        ]);

        const isAuthor = post.author.id === userId;
        const isLiked = post.likes.some((like) => like.userId === userId);
        const editedAt = post.editHistory[0]?.editedAt || null;

        const { likes: _likes, editHistory: _editHistory, ...postWithoutExtra } = post;

        return {
          ...postWithoutExtra,
          isAuthor,
          isLiked,
          likesCount,
          repliesCount,
          editedAt,
        };
      })
    );

    return NextResponse.json<GetGlobalTimelineResponse>({
      posts: postsWithCounts,
      nextCursor,
    });
  } catch (error) {
    return handleApiError(error);
  }
};
