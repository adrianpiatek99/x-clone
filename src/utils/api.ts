import { auth } from '@/auth';
import type { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import axios from 'axios';
import type { NextRequest } from 'next/server';
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

export const apiRequest = async <T, D = unknown>(
  method: Method,
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios({
      method,
      url,
      data,
      ...config,
    });

    return response.data;
  } catch (error) {
    throw error as Error;
  }
};

type AuthenticatedHandler = (req: NextRequest, userId: string) => Promise<Response>;

export const withAuth = (handler: AuthenticatedHandler) => async (req: NextRequest) => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new ApiError('Unauthorized', 401);
  }

  return handler(req, session.user.id);
};
