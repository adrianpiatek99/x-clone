import type {
  DeletePostParams,
  GetGlobalTimelineParams,
  GetPostDetailsParams,
  GetPostLikesParams,
  GetTrackTimelineParams,
  GetUserLikesParams,
  GetUserMediaParams,
  GetUserPostsParams,
  LikePostParams,
  UnlikePostParams,
  UpdatePostParams,
} from '@/types/post';
import type { FollowUserParams, GetProfileDetailsParams, UnfollowUserParams } from '@/types/user';
import { createUrlWithParams } from '@/utils/urlParams';

export const API_ENDPOINTS = {
  AUTH: {
    CURRENT_USER: '/api/auth/currentUser',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER: '/api/auth/register',
  },
  POSTS: {
    DETAILS: ({ postId }: GetPostDetailsParams) => `/api/posts/details/${postId}` as const,
    CREATE: '/api/posts/create',
    UPDATE: ({ id }: UpdatePostParams) => `/api/posts/update/${id}` as const,
    DELETE: ({ id }: DeletePostParams) => `/api/posts/delete/${id}` as const,
    GLOBAL_TIMELINE: (params: GetGlobalTimelineParams) =>
      createUrlWithParams('/api/posts/globalTimeline', params),
    POST_LIKES: ({ postId, ...params }: GetPostLikesParams) =>
      createUrlWithParams(`/api/posts/postLikes/${postId}`, params),
    LIKE: ({ postId }: LikePostParams) => `/api/posts/like/${postId}` as const,
    UNLIKE: ({ postId }: UnlikePostParams) => `/api/posts/unlike/${postId}` as const,
    TRACK_TIMELINE: ({ latestPostId }: GetTrackTimelineParams) =>
      createUrlWithParams('/api/posts/trackTimeline', { latestPostId }),
    USER_POSTS: ({ screenName, ...params }: GetUserPostsParams) =>
      createUrlWithParams(`/api/posts/userPosts/${screenName}`, params),
    USER_LIKES: ({ screenName, ...params }: GetUserLikesParams) =>
      createUrlWithParams(`/api/posts/userLikes/${screenName}`, params),
    USER_MEDIA: ({ screenName, ...params }: GetUserMediaParams) =>
      createUrlWithParams(`/api/posts/userMedia/${screenName}`, params),
  },
  PROFILE: {
    UPDATE: '/api/profile/update',
    DETAILS: ({ screenName }: GetProfileDetailsParams) =>
      `/api/profile/details/${screenName}` as const,
  },
  USERS: {
    FOLLOW: ({ userId }: FollowUserParams) => `/api/users/follow/${userId}` as const,
    UNFOLLOW: ({ userId }: UnfollowUserParams) => `/api/users/unfollow/${userId}` as const,
  },
} as const;
