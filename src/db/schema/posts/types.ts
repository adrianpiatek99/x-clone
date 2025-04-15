import { pgEnum } from 'drizzle-orm/pg-core';

import { enumToPgEnum } from '../helpers';
import type { UserPublic } from '../users';
import type { postRepliesTable } from './table';
import type { postLikesTable } from './table';
import type { postMediaTable } from './table';
import type { postsTable } from './table';

// Enums
export enum ConversationControl {
  ALL = 'ALL',
  COMMUNITY = 'COMMUNITY',
  BY_INVITATION = 'BY_INVITATION',
}

export enum PostMediaType {
  PHOTO = 'PHOTO',
  VIDEO = 'VIDEO',
}

export const ConversationControlEnum = pgEnum(
  'conversation_control',
  enumToPgEnum(ConversationControl)
);
export const PostMediaTypeEnum = pgEnum('post_media_type', enumToPgEnum(PostMediaType));

// Types
export type Post = typeof postsTable.$inferSelect & {
  author: UserPublic;
  media: PostMedia[];
  isAuthor: boolean;
  isLiked: boolean;
  likesCount: number;
  repliesCount: number;
};
export type PostMedia = typeof postMediaTable.$inferSelect;
export type PostLike = typeof postLikesTable.$inferSelect & {
  user: UserPublic;
};
export type PostReply = typeof postRepliesTable.$inferSelect;
