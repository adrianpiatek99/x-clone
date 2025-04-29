import { auth } from '@/auth';
import { db } from '@/db/db';
import type { Post, PostLike } from '@/db/schema';
import {
  postEditHistoryTable,
  postLikesTable,
  postRepliesTable,
  postsTable,
  userPublicColumns,
  usersTable,
} from '@/db/schema';
import { handleApiError } from '@/db/utils/api';
import { type CursorParams, cursorSchema, type NextCursor } from '@/schema/api';
import { and, desc, eq, lt, or } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export type GetUserLikesParams = {
  screenName: string;
} & CursorParams;

export type GetUserLikesResponse = {
  likes: (PostLike & { post: Post })[];
  nextCursor: NextCursor;
};

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<GetUserLikesParams> }
) => {
  try {
    const { searchParams } = new URL(request.url);
    const { screenName } = await params;
    const session = await auth();
    const userId = session?.user?.id;

    // Validate params
    const { cursor: cursorParam, limit } = cursorSchema.parse({
      cursor: searchParams.get('cursor') ? JSON.parse(searchParams.get('cursor')!) : undefined,
      limit: parseInt(searchParams.get('limit') ?? ''),
    });
    const cursor = cursorParam
      ? {
          ...cursorParam,
          createdAt: new Date(cursorParam.createdAt),
        }
      : undefined;
    const take = limit + 1;

    // Find user by screenName
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.screenName, screenName),
      columns: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch likes
    const likes = await db.query.postLikesTable.findMany({
      limit: take,
      where: and(
        eq(postLikesTable.userId, user.id),
        cursor
          ? or(
              lt(postsTable.createdAt, cursor.createdAt),
              and(eq(postsTable.createdAt, cursor.createdAt), lt(postsTable.id, cursor.id))
            )
          : undefined
      ),
      orderBy: [desc(postsTable.createdAt), desc(postsTable.id)],
      with: {
        post: {
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
        },
      },
    });

    // Calculate next cursor
    let nextCursor: GetUserLikesResponse['nextCursor'] = null;

    if (likes.length > limit) {
      likes.pop();

      const nextItem = likes[likes.length - 1];

      if (nextItem) {
        nextCursor = {
          id: nextItem.id,
          createdAt: nextItem.createdAt.toISOString(),
        };
      }
    }

    // Fetch counts and prepare response
    const likesWithCounts = await Promise.all(
      likes.map(async (like) => {
        const [likesCount, repliesCount] = await Promise.all([
          db.$count(postLikesTable, eq(postLikesTable.postId, like.postId)),
          db.$count(postRepliesTable, eq(postRepliesTable.postId, like.postId)),
        ]);

        const isAuthor = like.post.author.id === userId;
        const isLiked = like.post.likes.some((like) => like.userId === userId);
        const editedAt = like.post.editHistory[0]?.editedAt || null;

        const { likes: _likes, editHistory: _editHistory, ...postWithoutExtra } = like.post;

        return {
          ...like,
          user: postWithoutExtra.author,
          post: {
            ...postWithoutExtra,
            isAuthor,
            isLiked,
            likesCount,
            repliesCount,
            editedAt,
          },
        };
      })
    );

    return NextResponse.json<GetUserLikesResponse>({
      likes: likesWithCounts,
      nextCursor,
    });
  } catch (error) {
    return handleApiError(error);
  }
};
