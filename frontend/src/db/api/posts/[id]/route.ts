/**
 * Backend has been rewritten to Rust.
 * See: https://github.com/adrianpiatek99/x-clone/issues/67
 */

// import { auth } from '@/auth';
// import { db } from '@/db/db';
// import {
//   type Post,
//   postEditHistoryTable,
//   postLikesTable,
//   postRepliesTable,
//   postsTable,
//   userPublicColumns,
// } from '@/db/schema';
// import { ApiError, handleApiError } from '@/db/utils/api';
// import { desc, eq } from 'drizzle-orm';
// import { NextResponse } from 'next/server';

// export type GetPostParams = {
//   id: string;
// };

// export type GetPostResponse = Post;

// export const GET = async (_request: Request, { params }: { params: Promise<GetPostParams> }) => {
//   try {
//     const session = await auth();
//     const { id } = await params;
//     const userId = session?.user?.id;

//     // Fetch post
//     const post = await db.query.postsTable.findFirst({
//       where: eq(postsTable.id, id),
//       with: {
//         author: {
//           columns: userPublicColumns,
//         },
//         likes: {
//           where: userId ? eq(postLikesTable.userId, userId) : undefined,
//           columns: {
//             userId: true,
//           },
//         },
//         media: true,
//         editHistory: {
//           limit: 1,
//           columns: {
//             id: true,
//             editedAt: true,
//           },
//           orderBy: [desc(postEditHistoryTable.editedAt)],
//         },
//       },
//     });

//     if (!post) {
//       throw new ApiError('Post not found', 404);
//     }

//     // Fetch counts and prepare response
//     const [likesCount, repliesCount] = await Promise.all([
//       db.$count(postLikesTable, eq(postLikesTable.postId, post.id)),
//       db.$count(postRepliesTable, eq(postRepliesTable.postId, post.id)),
//     ]);

//     const isAuthor = post.author.id === userId;
//     const isLiked = post.likes.some((like) => like.userId === userId);
//     const editedAt = post.editHistory[0]?.editedAt || null;

//     const { likes: _likes, editHistory: _editHistory, ...postWithoutExtra } = post;

//     return NextResponse.json<GetPostResponse>({
//       ...postWithoutExtra,
//       isAuthor,
//       isLiked,
//       likesCount,
//       repliesCount,
//       editedAt,
//     });
//   } catch (error) {
//     return handleApiError(error);
//   }
// };
