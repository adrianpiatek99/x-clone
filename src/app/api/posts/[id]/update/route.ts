import { VALIDATION } from '@/constants/validation';
import { db } from '@/db/db';
import type { Post } from '@/db/schema';
import { userPublicColumns } from '@/db/schema';
import { PostMediaType } from '@/db/schema/posts';
import {
  postEditHistoryTable,
  postLikesTable,
  postMediaTable,
  postRepliesTable,
  postsTable,
} from '@/db/schema/posts/table';
import { ApiError, handleApiError } from '@/db/utils/api';
import { withAuth } from '@/db/utils/auth';
import { uploadFile } from '@/db/utils/uploadFile';
import { fileValidationConfigs, validateFile } from '@/db/utils/validateFile';
import { desc, eq, inArray } from 'drizzle-orm';
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
  removedMediaIds: z.array(z.string()).optional(),
  media: z.array(z.instanceof(File)).optional(),
}) satisfies z.ZodType<Pick<Post, 'text'> & { removedMediaIds?: string[]; media?: File[] }>;

export type UpdatePostRequest = z.infer<typeof schema>;

export type UpdatePostResponse = Post;

export const PATCH = withAuth(
  async (request, userId, { params }: { params: Promise<UpdatePostParams> }) => {
    try {
      const { id } = await params;
      const formData = await request.formData();

      // Validate payload
      const mediaFiles: File[] = [];
      const removedMediaIds: string[] = [];

      for (const [key, value] of formData.entries()) {
        if (key.startsWith('media[') && value instanceof File) {
          mediaFiles.push(value);
        } else if (key.startsWith('removedMediaIds[') && typeof value === 'string') {
          removedMediaIds.push(value);
        }
      }

      const { text } = schema.parse({
        text: formData.get('text'),
        removedMediaIds,
        media: mediaFiles,
      });

      // Check if post exists
      const post = await db.query.postsTable.findFirst({
        where: eq(postsTable.id, id),
        with: {
          media: true,
        },
      });

      if (!post) {
        throw new ApiError('Post not found', 404);
      }

      if (post.authorId !== userId) {
        throw new ApiError('Unauthorized', 403);
      }

      // Validate new media files
      if (mediaFiles.length) {
        const currentMediaCount = post.media.length;
        const removedMediaCount = removedMediaIds.length;
        const remainingMediaCount = currentMediaCount - removedMediaCount;
        const totalMediaCount = remainingMediaCount + mediaFiles.length;

        if (totalMediaCount > fileValidationConfigs.media.limit) {
          throw new ApiError(
            `Maximum ${fileValidationConfigs.media.limit} media files allowed per post. You currently have ${currentMediaCount} files, removing ${removedMediaCount} and adding ${mediaFiles.length} would exceed the limit.`,
            400
          );
        }

        mediaFiles.forEach((file) => {
          validateFile(file, fileValidationConfigs.media);
        });
      }

      // Start a transaction to ensure all operations succeed or fail together
      await db.transaction(async (tx) => {
        // Save the current text to edit history
        await tx.insert(postEditHistoryTable).values({
          postId: id,
          previousText: post.text,
        });

        // Update the post with new text
        await tx.update(postsTable).set({ text }).where(eq(postsTable.id, id));

        // Delete removed media if any
        if (removedMediaIds.length) {
          await tx.delete(postMediaTable).where(inArray(postMediaTable.id, removedMediaIds));
        }

        // Upload and add new media files if any
        if (mediaFiles.length) {
          const mediaResults = await Promise.all(mediaFiles.map((file) => uploadFile(file)));

          await tx.insert(postMediaTable).values(
            mediaResults.map(({ url, height, width }) => ({
              url,
              width,
              height,
              type: PostMediaType.PHOTO,
              postId: id,
              userId,
            }))
          );
        }
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
