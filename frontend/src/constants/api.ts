import type { GetPostLikesParams } from '@/app/api/posts/[id]/likes/route';
import type {
  DeletePostParams,
  GetGlobalTimelineParams,
  GetPostDetailsParams,
  GetTrackTimelineParams,
  GetUserLikesParams,
  GetUserMediaParams,
  GetUserPostsParams,
  LikePostParams,
  UnlikePostParams,
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
    DETAILS: ({ postId }: GetPostDetailsParams) =>
      `http://localhost:8080/api/posts/details/${postId}` as const,
    CREATE: 'http://localhost:8080/api/posts/create',
    UPDATE: ({ id }: UpdatePostParams) => `http://localhost:8080/api/posts/update/${id}` as const,
    DELETE: ({ id }: DeletePostParams) => `http://localhost:8080/api/posts/delete/${id}` as const,
    GLOBAL_TIMELINE: (params: GetGlobalTimelineParams) =>
      createUrlWithParams('http://localhost:8080/api/posts/globalTimeline', params),
    POST_LIKES: ({ id, ...params }: GetPostLikesParams) =>
      createUrlWithParams(`/api/posts/${id}/likes`, params),
    LIKE: ({ postId }: LikePostParams) => `http://localhost:8080/api/posts/like/${postId}` as const,
    UNLIKE: ({ postId }: UnlikePostParams) =>
      `http://localhost:8080/api/posts/unlike/${postId}` as const,
    TRACK_TIMELINE: ({ latestPostId }: GetTrackTimelineParams) =>
      createUrlWithParams('http://localhost:8080/api/posts/trackTimeline', { latestPostId }),
    USER_POSTS: ({ screenName, ...params }: GetUserPostsParams) =>
      createUrlWithParams(`http://localhost:8080/api/posts/userPosts/${screenName}`, params),
    USER_LIKES: ({ screenName, ...params }: GetUserLikesParams) =>
      createUrlWithParams(`http://localhost:8080/api/posts/userLikes/${screenName}`, params),
    USER_MEDIA: ({ screenName, ...params }: GetUserMediaParams) =>
      createUrlWithParams(`http://localhost:8080/api/posts/userMedia/${screenName}`, params),
  },
  PROFILE: {
    UPDATE: 'http://localhost:8080/api/profile/update',
    DETAILS: ({ screenName }: GetProfileDetailsParams) =>
      `http://localhost:8080/api/profile/details/${screenName}` as const,
  },
} as const;
