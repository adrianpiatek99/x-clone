import { pgEnum } from 'drizzle-orm/pg-core';

import { enumToPgEnum } from '../helpers';
import type { User } from '../users';
import type { postRepliesTable } from './table';
import type { postLikesTable } from './table';
import type { postMediaTable } from './table';
import type { postsTable } from './table';

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

export type Post = typeof postsTable.$inferSelect & {
  author: PostAuthor;
  media: PostMedia[];
  isLiked: boolean;
};
export type PostMedia = typeof postMediaTable.$inferSelect;
export type PostLike = typeof postLikesTable.$inferSelect;
export type PostReply = typeof postRepliesTable.$inferSelect;

export type PostAuthor = Pick<
  User,
  'id' | 'name' | 'screenName' | 'profileImageUrl' | 'isVerified'
>;
