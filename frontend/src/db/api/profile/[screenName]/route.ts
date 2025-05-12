/**
 * Backend has been rewritten to Rust.
 * See: https://github.com/adrianpiatek99/x-clone/issues/67
 */

// import { db } from '@/db/db';
// import type { UserProfile } from '@/db/schema';
// import { userPublicColumns, usersTable } from '@/db/schema';
// import { postsTable } from '@/db/schema';
// import { handleApiError } from '@/db/utils/api';
// import { eq } from 'drizzle-orm';
// import { type NextRequest, NextResponse } from 'next/server';

// export type GetUserByScreenNameParams = {
//   screenName: string;
// };

// export type GetUserByScreenNameResponse = UserProfile;

// export const GET = async (
//   _request: NextRequest,
//   { params }: { params: Promise<GetUserByScreenNameParams> }
// ) => {
//   try {
//     const { screenName } = await params;

//     const user = await db.query.usersTable.findFirst({
//       where: eq(usersTable.screenName, screenName),
//       columns: userPublicColumns,
//     });

//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     const postsCount = await db.$count(postsTable, eq(postsTable.authorId, user.id));

//     return NextResponse.json<GetUserByScreenNameResponse>({
//       ...user,
//       isFollowing: false,
//       followersCount: 0,
//       followingCount: 0,
//       postsCount,
//     });
//   } catch (error) {
//     return handleApiError(error);
//   }
// };
