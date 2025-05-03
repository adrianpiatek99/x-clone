import { auth } from '@/auth';
import { db } from '@/db/db';
import {
  type Post,
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
import { type NextRequest, NextResponse } from 'next/server';

export type GetUserPostsParams = {
  screenName: string;
} & CursorParams;

export type GetUserPostsResponse = {
  posts: Post[];
  nextCursor: NextCursor;
  totalCount: number;
};

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<GetUserPostsParams> }
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

    // Fetch posts
    const posts = await db.query.postsTable.findMany({
      limit: take,
      where: and(
        eq(postsTable.authorId, user.id),
        cursor
          ? or(
              lt(postsTable.createdAt, cursor.createdAt),
              and(eq(postsTable.createdAt, cursor.createdAt), lt(postsTable.id, cursor.id))
            )
          : undefined
      ),
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

    // Get total count of likes
    const totalCount = await db.$count(postsTable, eq(postsTable.authorId, user.id));

    // Calculate next cursor
    let nextCursor: GetUserPostsResponse['nextCursor'] = null;

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

    return NextResponse.json<GetUserPostsResponse>({
      posts: postsWithCounts,
      nextCursor,
      totalCount,
    });
  } catch (error) {
    return handleApiError(error);
  }
};
