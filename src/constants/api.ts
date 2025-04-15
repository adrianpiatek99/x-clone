import type { LikesPostParams } from '@/app/api/posts/[id]/likes/route';
import type { GlobalPostsTimelineParams } from '@/app/api/posts/globalTimeline/route';

export const API_ENDPOINTS = {
  AUTH: {
    SIGN_UP: '/api/auth/signUp',
  },
  POSTS: {
    LIST: '/api/posts',
    CREATE: '/api/posts/create',
    DETAILS: (id: string) => `/api/posts/${id}` as const,
    DELETE: (id: string) => `/api/posts/${id}` as const,
    GLOBAL_TIMELINE: (params?: GlobalPostsTimelineParams) => {
      const searchParams = new URLSearchParams();

      if (params?.cursor) searchParams.append('cursor', JSON.stringify(params.cursor));

      if (params?.limit) searchParams.append('limit', params.limit.toString());

      return `/api/posts/globalTimeline${searchParams.toString() ? `?${searchParams.toString()}` : ''}` as const;
    },
    POST_LIKES: (params: LikesPostParams) => {
      const { id, cursor, limit } = params;

      const searchParams = new URLSearchParams();

      if (cursor) searchParams.append('cursor', JSON.stringify(cursor));

      if (limit) searchParams.append('limit', limit.toString());

      return `/api/posts/${id}/likes${searchParams.toString() ? `?${searchParams.toString()}` : ''}` as const;
    },
    LIKE: (id: string) => `/api/posts/${id}/like` as const,
    UNLIKE: (id: string) => `/api/posts/${id}/unlike` as const,
  },
  PROFILE: {
    UPDATE: '/api/profile/update',
  },
} as const;
