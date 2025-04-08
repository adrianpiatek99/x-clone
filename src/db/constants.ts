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
export const POST_TEXT_MAX_LENGTH = 500;

export const PROFILE_NAME_MIN_LENGTH = 4;
export const PROFILE_NAME_MAX_LENGTH = 50;
export const PROFILE_SCREEN_NAME_MIN_LENGTH = 4;
export const PROFILE_SCREEN_NAME_MAX_LENGTH = 15;
export const PROFILE_DESCRIPTION_MAX_LENGTH = 160;
export const PROFILE_WEBSITE_MAX_LENGTH = 100;
export const EMAIL_MAX_LENGTH = 100;
export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 32;
