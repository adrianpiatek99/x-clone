import type { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import axios from 'axios';

export const apiRequest = async <T, D = unknown>(
  method: Method,
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios({
      baseURL: process.env.NEXT_PUBLIC_API_URL ?? '',
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
