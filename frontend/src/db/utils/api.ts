import type { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import axios from 'axios';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: unknown) => {
  if (error instanceof ZodError) {
    return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
  }

  if (error instanceof ApiError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }

  if (error instanceof Error) {
    if (
      error.message.includes('unique constraint') ||
      error.message.includes('duplicate key value')
    ) {
      return NextResponse.json({ message: 'Resource already exists' }, { status: 409 });
    }
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
      withCredentials: true,
      ...config,
    });

    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
