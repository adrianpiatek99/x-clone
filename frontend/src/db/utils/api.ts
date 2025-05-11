/**
 * Backend has been rewritten to Rust.
 * See: https://github.com/adrianpiatek99/x-clone/issues/67
 */

// import { NextResponse } from 'next/server';
// import { ZodError } from 'zod';

// export class ApiError extends Error {
//   constructor(
//     message: string,
//     public status: number
//   ) {
//     super(message);
//     this.name = 'ApiError';
//   }
// }

// export const handleApiError = (error: unknown) => {
//   if (error instanceof ZodError) {
//     return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
//   }

//   if (error instanceof ApiError) {
//     return NextResponse.json({ message: error.message }, { status: error.status });
//   }

//   if (error instanceof Error) {
//     if (
//       error.message.includes('unique constraint') ||
//       error.message.includes('duplicate key value')
//     ) {
//       return NextResponse.json({ message: 'Resource already exists' }, { status: 409 });
//     }
//   }

//   return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
// };
