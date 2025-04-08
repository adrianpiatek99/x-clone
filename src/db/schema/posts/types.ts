import { pgEnum } from 'drizzle-orm/pg-core';

import type { postRepliesTable } from './table';
import type { postLikesTable } from './table';
import type { postMediaTable } from './table';
import type { postsTable } from './table';

export const ConversationControl = pgEnum('conversation_control', [
  'ALL',
  'COMMUNITY',
  'BY_INVITATION',
]);

export const PostMediaType = pgEnum('post_media_type', ['PHOTO', 'VIDEO']);

export type Post = typeof postsTable.$inferSelect;
export type PostMedia = typeof postMediaTable.$inferSelect;
export type PostLike = typeof postLikesTable.$inferSelect;
export type PostReply = typeof postRepliesTable.$inferSelect;
