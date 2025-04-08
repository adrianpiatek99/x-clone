import { db } from '@/db/db';
import { POST_MEDIA_LIMIT } from '@/db/constants';
import { Post, postLikesTable, postMediaTable, postsTable } from '@/db/schema/posts';
import { ApiError, handleApiError } from '@/db/utils/api';
import { withAuth } from '@/db/utils/auth';
import { uploadFile } from '@/db/utils/uploadFile';
import { fileValidationConfigs, validateFile } from '@/db/utils/validateFile';
import { imageFileTypes } from '@/constants/fileTypes';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export type CreatePostRequest = Pick<Post, 'text'> & {
  media?: File[] | null;
  conversationControl?: Post['conversationControl'];
};

const createPostSchema = z.object({
  text: z.string().min(1).max(280),
  media: z
    .array(
      z.object({
        url: z.string().url(),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
        type: z.enum(['PHOTO', 'VIDEO'] as const),
      })
    )
    .optional(),
  conversationControl: z.enum(['ALL', 'COMMUNITY', 'BY_INVITATION'] as const).optional(),
});

export const POST = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const formData = await request.formData();

    const { text, conversationControl } = createPostSchema.parse({
      text: formData.get('text') as string,
      conversationControl: formData.get('conversationControl') as
        | Post['conversationControl']
        | null,
    });

    // Create post
    const [post] = await db
      .insert(postsTable)
      .values({
        text,
        authorId: userId,
        conversationControl: conversationControl || 'ALL',
      })
      .returning();

    if (!post) {
      throw new ApiError('Failed to create post', 500);
    }

    // Validate media files and upload them
    const mediaFiles: File[] = [];

    for (const [key, value] of formData.entries()) {
      if (key.startsWith('media[')) {
        if (value instanceof File) {
          mediaFiles.push(value);
        }
      }
    }

    if (!!mediaFiles.length) {
      if (mediaFiles.length > POST_MEDIA_LIMIT) {
        throw new ApiError(`Maximum ${POST_MEDIA_LIMIT} media files allowed per post`, 400);
      }

      mediaFiles.forEach((file) => {
        validateFile(file, {
          ...fileValidationConfigs.media,
          allowedTypes: imageFileTypes,
        });
      });

      const mediaResults = await Promise.all(mediaFiles.map((file) => uploadFile(file)));

      await db.insert(postMediaTable).values(
        mediaResults.map((media) => ({
          url: media.url,
          width: media.width,
          height: media.height,
          type: 'PHOTO' as const,
          postId: post.id,
        }))
      );
    }

    // Fetch created post
    const createdPost = await db.query.postsTable.findFirst({
      where: eq(postsTable.id, post.id),
      with: {
        author: {
          columns: {
            id: true,
            name: true,
            screenName: true,
            profileImageUrl: true,
            isVerified: true,
          },
        },
        likes: {
          where: eq(postLikesTable.userId, userId),
          columns: {
            userId: true,
          },
        },
        media: true,
      },
    });

    if (!createdPost) {
      throw new ApiError('Failed to fetch created post', 500);
    }

    const isLiked = createdPost.likes.length > 0;

    return NextResponse.json({ ...createdPost, isLiked }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
});
