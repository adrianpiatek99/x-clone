import { db } from '@/db/db';
import type { PostLike } from '@/db/schema';
import { postLikesTable, userPublicColumns } from '@/db/schema';
import { handleApiError } from '@/db/utils/api';
import { type CursorParams, cursorSchema, type NextCursor } from '@/schema/api';
import { and, desc, eq, lt, or } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export type GetPostLikesParams = {
  id: string;
} & CursorParams;

export type GetPostLikesResponse = {
  postLikes: PostLike[];
  nextCursor: NextCursor;
};

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<GetPostLikesParams> }
) => {
  try {
    const { searchParams } = new URL(request.url);
    const { id } = await params;

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

    // Fetch post likes
    const postLikes = await db.query.postLikesTable.findMany({
      limit: take,
      where: and(
        eq(postLikesTable.postId, id),
        cursor
          ? or(
              lt(postLikesTable.createdAt, cursor.createdAt),
              and(eq(postLikesTable.createdAt, cursor.createdAt), lt(postLikesTable.id, cursor.id))
            )
          : undefined
      ),
      orderBy: [desc(postLikesTable.createdAt), desc(postLikesTable.id)],
      with: {
        user: {
          columns: userPublicColumns,
        },
      },
    });

    // Calculate next cursor
    let nextCursor: GetPostLikesResponse['nextCursor'] = null;

    if (postLikes.length > limit) {
      postLikes.pop();

      const nextItem = postLikes[postLikes.length - 1];

      if (nextItem) {
        nextCursor = {
          id: nextItem.id,
          createdAt: nextItem.createdAt.toISOString(),
        };
      }
    }

    return NextResponse.json<GetPostLikesResponse>({
      postLikes,
      nextCursor,
    });
  } catch (error) {
    return handleApiError(error);
  }
};
