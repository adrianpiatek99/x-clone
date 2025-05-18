export const QUERY_KEYS = {
  AUTH: {
    CURRENT_USER: ['currentUser'],
  },
  POSTS: {
    GLOBAL_TIMELINE: ['globalTimeline', 'infinite'],
    POST_LIKES: {
      BASE: ['postLikes', 'infinite'],
      WITH_PARAMS: (id: string, limit: number) => [...QUERY_KEYS.POSTS.POST_LIKES.BASE, id, limit],
    },
    DETAILS: (id: string) => ['postDetails', id],
    TRACK_TIMELINE: ['trackTimeline'],
    USER_POSTS: {
      BASE: ['userPosts', 'infinite'],
      WITH_PARAMS: (screenName: string) => [...QUERY_KEYS.POSTS.USER_POSTS.BASE, screenName],
    },
    USER_LIKES: {
      BASE: ['userLikes', 'infinite'],
      WITH_PARAMS: (screenName: string) => [...QUERY_KEYS.POSTS.USER_LIKES.BASE, screenName],
    },
    USER_MEDIA: {
      BASE: ['userMedia', 'infinite'],
      WITH_PARAMS: (screenName: string) => [...QUERY_KEYS.POSTS.USER_MEDIA.BASE, screenName],
    },
  },
  PROFILE: {
    USER_BY_SCREEN_NAME: (screenName: string) => ['userByScreenName', screenName] as const,
    FOLLOWERS: (screenName: string) => ['followers', screenName, 'infinite'] as const,
    FOLLOWING: (screenName: string) => ['following', screenName, 'infinite'] as const,
  },
} as const;
