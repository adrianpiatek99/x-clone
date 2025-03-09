import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const handleApiError = (error: unknown) => {
  if (error instanceof ZodError) {
    return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
  }

  if (error instanceof ApiError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }

  return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
};
