import { db } from '@/db/db';
import type { User } from '@/db/schema';
import { usersTable } from '@/db/schema';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export type GetUsersResponse = Omit<User, 'password' | 'emailVerified'>[];
export type ErrorResponse = { message: string };

export const GET = async (
  _request: NextRequest
): Promise<NextResponse<GetUsersResponse | ErrorResponse>> => {
  try {
    const users = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        screenName: usersTable.screenName,
        email: usersTable.screenName,
        profileImageUrl: usersTable.profileImageUrl,
        profileBannerUrl: usersTable.profileBannerUrl,
        description: usersTable.description,
        url: usersTable.url,
        role: usersTable.role,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
      })
      .from(usersTable);

    return NextResponse.json(users);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json({ message: errorMessage }, { status: 400 });
  }
};
