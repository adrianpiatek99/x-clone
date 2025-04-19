import { VALIDATION } from '@/constants/validation';
import { db } from '@/db/db';
import type { Post } from '@/db/schema';
import { userPublicColumns } from '@/db/schema';
import {
  postEditHistoryTable,
  postLikesTable,
  postRepliesTable,
  postsTable,
} from '@/db/schema/posts/table';
import { ApiError, handleApiError } from '@/db/utils/api';
import { withAuth } from '@/db/utils/auth';
import { desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export type UpdatePostParams = { id: string };

const schema = z.object({
  text: z
    .string()
    .min(1)
    .refine((text) => text.trim().replaceAll(/\s+/g, ' ').length <= VALIDATION.POST.TEXT.MAX, {
      message: `Text exceeds maximum length of ${VALIDATION.POST.TEXT.MAX} characters`,
    }),
}) satisfies z.ZodType<Pick<Post, 'text'>>;

export type UpdatePostRequest = z.infer<typeof schema>;

export type UpdatePostResponse = Post;

export const PATCH = withAuth(
  async (request, userId, { params }: { params: Promise<UpdatePostParams> }) => {
    try {
      const { id } = await params;
      const body = await request.json();

      const { text } = schema.parse(body);

      const [post] = await db.select().from(postsTable).where(eq(postsTable.id, id));

      if (!post) {
        throw new ApiError('Post not found', 404);
      }

      if (post.authorId !== userId) {
        throw new ApiError('Unauthorized', 403);
      }

      // Start a transaction to ensure both operations succeed or fail together
      await db.transaction(async (tx) => {
        // Save the current text to edit history
        await tx.insert(postEditHistoryTable).values({
          postId: id,
          previousText: post.text,
        });

        // Update the post with new text
        await tx.update(postsTable).set({ text }).where(eq(postsTable.id, id));
      });

      // Fetch updated post and counts
      const [updatedPost, likesCount, repliesCount] = await Promise.all([
        db.query.postsTable.findFirst({
          where: eq(postsTable.id, post.id),
          with: {
            author: {
              columns: userPublicColumns,
            },
            likes: {
              where: eq(postLikesTable.userId, userId),
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
        }),
        db.$count(postLikesTable, eq(postLikesTable.postId, post.id)),
        db.$count(postRepliesTable, eq(postRepliesTable.postId, post.id)),
      ]);

      if (!updatedPost) {
        throw new ApiError('Post not found', 404);
      }

      // Prepare response
      const isAuthor = updatedPost.author.id === userId;
      const isLiked = updatedPost.likes.some((like) => like.userId === userId);
      const editedAt = updatedPost.editHistory[0]?.editedAt || null;

      const { likes: _likes, editHistory: _editHistory, ...postWithoutExtra } = updatedPost;

      return NextResponse.json<UpdatePostResponse>(
        {
          ...postWithoutExtra,
          isAuthor,
          isLiked,
          likesCount,
          repliesCount,
          editedAt,
        },
        { status: 200 }
      );
    } catch (error) {
      return handleApiError(error);
    }
  }
);
