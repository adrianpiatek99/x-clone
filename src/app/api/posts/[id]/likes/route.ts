import { db } from '@/db/db';
import type { PostLike } from '@/db/schema';
import { postLikesTable, userPublicColumns } from '@/db/schema';
import { handleApiError } from '@/db/utils/api';
import { and, desc, eq, lt, or } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

export type LikesPostParams = {
  id: string;
  cursor?: {
    id: string;
    createdAt: Date;
  };
  limit?: number;
};

export type LikesPostResponse = {
  postLikes: PostLike[];
  nextCursor: { id: string; createdAt: string } | null;
};

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<LikesPostParams> }
) => {
  try {
    const { searchParams } = new URL(request.url);
    const { id } = await params;

    // Validate cursor
    const cursorStr = searchParams.get('cursor');
    const cursor: LikesPostParams['cursor'] = cursorStr
      ? {
          ...JSON.parse(cursorStr),
          createdAt: new Date(JSON.parse(cursorStr).createdAt),
        }
      : undefined;
    const limit = parseInt(searchParams.get('limit') || '20', 10);
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
    let nextCursor: LikesPostResponse['nextCursor'] = null;

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

    return NextResponse.json<LikesPostResponse>({
      postLikes,
      nextCursor,
    });
  } catch (error) {
    return handleApiError(error);
  }
};
