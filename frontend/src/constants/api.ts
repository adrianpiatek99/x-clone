import type { GetUserLikesParams } from '@/app/api/[screenName]/userLikes/route';
import type { GetUserMediaParams } from '@/app/api/[screenName]/userMedia/route';
import type { GetUserPostsParams } from '@/app/api/[screenName]/userPosts/route';
import type { LikePostParams } from '@/app/api/posts/[id]/like/route';
import type { GetPostLikesParams } from '@/app/api/posts/[id]/likes/route';
import type { UnlikePostParams } from '@/app/api/posts/[id]/unlike/route';
import type { GetTrackTimelineParams } from '@/app/api/posts/trackTimeline/route';
import type {
  DeletePostParams,
  GetGlobalTimelineParams,
  GetPostDetailsParams,
  UpdatePostParams,
} from '@/types/post';
import type { GetProfileDetailsParams } from '@/types/user';
import { createUrlWithParams } from '@/utils/urlParams';

export const API_ENDPOINTS = {
  AUTH: {
    CURRENT_USER: 'http://localhost:8080/api/auth/currentUser',
    LOGIN: 'http://localhost:8080/api/auth/login',
    LOGOUT: 'http://localhost:8080/api/auth/logout',
    REGISTER: 'http://localhost:8080/api/auth/register',
  },
  POSTS: {
    LIST: '/api/posts',
    DETAILS: ({ postId }: GetPostDetailsParams) =>
      `http://localhost:8080/api/posts/details/${postId}` as const,
    CREATE: 'http://localhost:8080/api/posts/create',
    UPDATE: ({ id }: UpdatePostParams) => `http://localhost:8080/api/posts/update/${id}` as const,
    DELETE: ({ id }: DeletePostParams) => `http://localhost:8080/api/posts/delete/${id}` as const,
    GLOBAL_TIMELINE: (params: GetGlobalTimelineParams) =>
      createUrlWithParams('http://localhost:8080/api/posts/globalTimeline', params),
    POST_LIKES: ({ id, ...params }: GetPostLikesParams) =>
      createUrlWithParams(`/api/posts/${id}/likes`, params),
    LIKE: ({ id }: LikePostParams) => `/api/posts/${id}/like` as const,
    UNLIKE: ({ id }: UnlikePostParams) => `/api/posts/${id}/unlike` as const,
    TRACK_TIMELINE: ({ latestPostId }: GetTrackTimelineParams) =>
      createUrlWithParams('/api/posts/trackTimeline', { latestPostId }),
    USER_POSTS: ({ screenName, ...params }: GetUserPostsParams) =>
      createUrlWithParams(`/api/${screenName}/userPosts`, params),
    USER_LIKES: ({ screenName, ...params }: GetUserLikesParams) =>
      createUrlWithParams(`/api/${screenName}/userLikes`, params),
    USER_MEDIA: ({ screenName, ...params }: GetUserMediaParams) =>
      createUrlWithParams(`/api/${screenName}/userMedia`, params),
  },
  PROFILE: {
    UPDATE: 'http://localhost:8080/api/profile/update',
    DETAILS: ({ screenName }: GetProfileDetailsParams) =>
      `http://localhost:8080/api/profile/details/${screenName}` as const,
  },
} as const;
