import type { DeletePostParams } from '@/app/api/posts/[id]/delete/route';
import type { LikePostParams } from '@/app/api/posts/[id]/like/route';
import type { GetPostLikesParams } from '@/app/api/posts/[id]/likes/route';
import type { UnlikePostParams } from '@/app/api/posts/[id]/unlike/route';
import type { GetGlobalTimelineParams } from '@/app/api/posts/globalTimeline/route';
import { createUrlWithParams } from '@/utils/urlParams';

export const API_ENDPOINTS = {
  AUTH: {
    SIGN_UP: '/api/auth/signUp',
  },
  POSTS: {
    LIST: '/api/posts',
    CREATE: '/api/posts/create',
    DETAILS: (id: string) => `/api/posts/${id}` as const,
    DELETE: ({ id }: DeletePostParams) => `/api/posts/${id}/delete` as const,
    GLOBAL_TIMELINE: (params: GetGlobalTimelineParams) =>
      createUrlWithParams('/api/posts/globalTimeline', params),
    POST_LIKES: ({ id, ...params }: GetPostLikesParams) =>
      createUrlWithParams(`/api/posts/${id}/likes`, params),
    LIKE: ({ id }: LikePostParams) => `/api/posts/${id}/like` as const,
    UNLIKE: ({ id }: UnlikePostParams) => `/api/posts/${id}/unlike` as const,
  },
  PROFILE: {
    UPDATE: '/api/profile/update',
  },
} as const;
