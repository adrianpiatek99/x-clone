import { db } from '@/db/db';
import { usersTable } from '@/db/schema';
import type { SignUpValues } from '@/schemas';
import { signUpSchema } from '@/schemas';
import { ApiError, handleApiError } from '@/utils/api';
import { hashSync } from 'bcryptjs';
import { eq, ilike, or } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

export type SignUpRequest = SignUpValues;

export const POST = async (request: NextRequest): Promise<NextResponse<object>> => {
  try {
    const body: SignUpRequest = await request.json();

    signUpSchema().parse(body);

    const { screenName, email, name, password } = body;

    const emailWithLowerCase = email.toLowerCase();

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(or(ilike(usersTable.screenName, screenName), eq(usersTable.email, emailWithLowerCase)))
      .then((res) => res[0]);

    if (existingUser) {
      if (existingUser.screenName.toLowerCase() === screenName.toLowerCase()) {
        throw new ApiError('Username is already in use', 409);
      }

      throw new ApiError('We cannot create account', 409);
    }

    const hashedPassword = hashSync(password, 12);

    await db
      .insert(usersTable)
      .values({
        screenName,
        name,
        email: emailWithLowerCase,
        password: hashedPassword,
      })
      .returning();

    return NextResponse.json({});
  } catch (error) {
    return handleApiError(error);
  }
};
