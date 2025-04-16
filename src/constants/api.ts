import type { GetPostLikesParams } from '@/app/api/posts/[id]/likes/route';
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
    DELETE: (id: string) => `/api/posts/${id}` as const,
    GLOBAL_TIMELINE: (params: GetGlobalTimelineParams) =>
      createUrlWithParams('/api/posts/globalTimeline', params),
    POST_LIKES: (params: GetPostLikesParams) => {
      const { id, ...props } = params;

      return createUrlWithParams(`/api/posts/${id}/likes`, props);
    },
    LIKE: (id: string) => `/api/posts/${id}/like` as const,
    UNLIKE: (id: string) => `/api/posts/${id}/unlike` as const,
  },
  PROFILE: {
    UPDATE: '/api/profile/update',
  },
} as const;
