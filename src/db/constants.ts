export const API_ENDPOINTS = {
  AUTH: {
    SIGN_UP: '/api/auth/signUp',
  },
  POSTS: {
    LIST: '/api/posts',
    CREATE: '/api/posts',
    DETAILS: (id: string) => `/api/posts/${id}`,
    DELETE: (id: string) => `/api/posts/${id}`,
  },
  PROFILE: {
    UPDATE: '/api/profile/update',
  },
} as const;
