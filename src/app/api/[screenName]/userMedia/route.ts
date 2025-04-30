import { auth } from '@/auth';
import { db } from '@/db/db';
import type { Post } from '@/db/schema';
import {
  postEditHistoryTable,
  postLikesTable,
  postMediaTable,
  postRepliesTable,
  postsTable,
  userPublicColumns,
  usersTable,
} from '@/db/schema';
import { handleApiError } from '@/db/utils/api';
import { type CursorParams, cursorSchema, type NextCursor } from '@/schema/api';
import { and, desc, eq, lt, or, sql } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export type GetUserMediaParams = {
  screenName: string;
} & CursorParams;

export type GetUserMediaResponse = {
  posts: Post[];
  nextCursor: NextCursor;
  totalCount: number;
};

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<GetUserMediaParams> }
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

    // Fetch posts that have media
    const posts = await db.query.postsTable.findMany({
      limit: take,
      where: and(
        eq(postsTable.authorId, user.id),
        cursor
          ? or(
              lt(postsTable.createdAt, cursor.createdAt),
              and(eq(postsTable.createdAt, cursor.createdAt), lt(postsTable.id, cursor.id))
            )
          : undefined,
        // Only select posts that have media
        sql`EXISTS (
          SELECT 1 FROM ${postMediaTable} as pm2
          WHERE pm2.post_id = ${postsTable.id}
        )`
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

    // Get total count of posts with media
    const totalCount = await db.$count(
      postsTable,
      and(
        eq(postsTable.authorId, user.id),
        sql`EXISTS (
          SELECT 1 FROM ${postMediaTable} as pm2
          WHERE pm2.post_id = ${postsTable.id}
        )`
      )
    );

    // Calculate next cursor
    let nextCursor: GetUserMediaResponse['nextCursor'] = null;

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

    return NextResponse.json<GetUserMediaResponse>({
      posts: postsWithCounts,
      nextCursor,
      totalCount,
    });
  } catch (error) {
    return handleApiError(error);
  }
};
