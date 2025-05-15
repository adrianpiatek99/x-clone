/**
 * Backend has been rewritten to Rust.
 * See: https://github.com/adrianpiatek99/x-clone/issues/67
 */

// import { db } from '@/db/db';
// import { usersTable } from '@/db/schema';
// import { ApiError, handleApiError } from '@/db/utils/api';
// import type { SignUpValues } from '@/schema/auth';
// import { signUpSchema } from '@/schema/auth';
// import { hashSync } from 'bcryptjs';
// import { eq, ilike, or } from 'drizzle-orm';
// import { type NextRequest, NextResponse } from 'next/server';

// export type SignUpRequest = SignUpValues;

// export const POST = async (request: NextRequest): Promise<NextResponse<object>> => {
//   try {
//     const body: SignUpRequest = await request.json();

//     const { screenName, name, email, password } = signUpSchema().parse(body);

//     const existingUser = await db
//       .select()
//       .from(usersTable)
//       .where(or(ilike(usersTable.screenName, screenName), eq(usersTable.email, email)))
//       .then((res) => res[0]);

//     if (existingUser) {
//       if (existingUser.screenName.toLowerCase() === screenName.toLowerCase()) {
//         throw new ApiError('Username is already in use', 409);
//       }

//       throw new ApiError('We cannot create account', 409);
//     }

//     const hashedPassword = hashSync(password, 12);

//     await db.insert(usersTable).values({
//       screenName,
//       name,
//       email,
//       password: hashedPassword,
//     });

//     return NextResponse.json({});
//   } catch (error) {
//     return handleApiError(error);
//   }
// };
