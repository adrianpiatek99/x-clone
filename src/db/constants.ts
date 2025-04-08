export const API_ENDPOINTS = {
  AUTH: {
    SIGN_UP: '/api/auth/signUp',
  },
  POSTS: {
    LIST: '/api/posts',
    CREATE: '/api/posts/create',
    DETAILS: (id: string) => `/api/posts/${id}`,
    DELETE: (id: string) => `/api/posts/${id}`,
  },
  PROFILE: {
    UPDATE: '/api/profile/update',
  },
} as const;

export const POST_MEDIA_LIMIT = 4;
export const POST_MEDIA_SIZE_MB_LIMIT = 2.5;
