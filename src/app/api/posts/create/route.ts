import { VALIDATION } from '@/constants/validation';
import { db } from '@/db/db';
import { userPublicColumns } from '@/db/schema';
import { enumToPgEnum } from '@/db/schema/helpers';
import type { Post } from '@/db/schema/posts';
import {
  ConversationControl,
  postEditHistoryTable,
  postLikesTable,
  postMediaTable,
  PostMediaType,
  postRepliesTable,
  postsTable,
} from '@/db/schema/posts';
import { ApiError, handleApiError } from '@/db/utils/api';
import { withAuth } from '@/db/utils/auth';
import { uploadFile } from '@/db/utils/uploadFile';
import { fileValidationConfigs, validateFile } from '@/db/utils/validateFile';
import { desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  text: z
    .string()
    .min(1)
    .refine((text) => text.trim().replaceAll(/\s+/g, ' ').length <= VALIDATION.POST.TEXT.MAX, {
      message: `Text exceeds maximum length of ${VALIDATION.POST.TEXT.MAX} characters`,
    }),
  media: z.array(z.instanceof(File)).nullish(),
  conversationControl: z.enum(enumToPgEnum(ConversationControl)).nullish(),
}) satisfies z.ZodType<
  Pick<Post, 'text'> & {
    media?: File[] | null;
    conversationControl?: ConversationControl | null;
  }
>;

export type CreatePostRequest = z.infer<typeof schema>;

export type CreatePostResponse = Post;

export const POST = withAuth(async (request, userId: string) => {
  try {
    const formData = await request.formData();

    // Validate payload
    const mediaFiles: File[] = [];

    for (const [key, value] of formData.entries()) {
      if (key.startsWith('media[') && value instanceof File) {
        mediaFiles.push(value);
      }
    }

    const { text, conversationControl } = schema.parse({
      text: formData.get('text'),
      media: mediaFiles,
      conversationControl: formData.get('conversationControl'),
    });

    // Validate media files
    if (mediaFiles.length) {
      if (mediaFiles.length > fileValidationConfigs.media.limit) {
        throw new ApiError(
          `Maximum ${fileValidationConfigs.media.limit} media files allowed per post`,
          400
        );
      }

      mediaFiles.forEach((file) => {
        validateFile(file, fileValidationConfigs.media);
      });
    }

    // Create post
    const [post] = await db
      .insert(postsTable)
      .values({
        text,
        authorId: userId,
        conversationControl: conversationControl || ConversationControl.ALL,
      })
      .returning();

    if (!post) {
      throw new ApiError('Failed to create post', 500);
    }

    // Upload media files
    if (mediaFiles.length) {
      const mediaResults = await Promise.all(mediaFiles.map((file) => uploadFile(file)));

      await db.insert(postMediaTable).values(
        mediaResults.map((media) => ({
          url: media.url,
          width: media.width,
          height: media.height,
          type: PostMediaType.PHOTO,
          postId: post.id,
        }))
      );
    }

    // Fetch created post and counts
    const [createdPost, likesCount, repliesCount] = await Promise.all([
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

    if (!createdPost) {
      throw new ApiError('Failed to fetch created post', 500);
    }

    // Prepare response
    const isAuthor = createdPost.author.id === userId;
    const isLiked = createdPost.likes.some((like) => like.userId === userId);
    const editedAt = createdPost.editHistory[0]?.editedAt || null;

    const { likes: _likes, editHistory: _editHistory, ...postWithoutExtra } = createdPost;

    return NextResponse.json<CreatePostResponse>(
      { ...postWithoutExtra, isAuthor, isLiked, likesCount, repliesCount, editedAt },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
});
