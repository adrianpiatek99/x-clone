export const QUERY_KEYS = {
  AUTH: {
    CURRENT_USER: ['currentUser'],
  },
  POSTS: {
    GLOBAL_TIMELINE: {
      BASE: ['globalTimeline', 'infinite'],
    },
    TRACK_TIMELINE: ['trackTimeline'],
    DETAILS: { BASE: ['postDetails'], WITH_PARAMS: (id: string) => ['postDetails', id] },
    POST_LIKES: {
      BASE: ['postLikes', 'infinite'],
      WITH_PARAMS: (id: string, limit: number) => [...QUERY_KEYS.POSTS.POST_LIKES.BASE, id, limit],
    },
    POST_REPLIES: {
      BASE: ['postReplies', 'infinite'],
      WITH_PARAMS: (id: string) => [...QUERY_KEYS.POSTS.POST_REPLIES.BASE, id],
    },
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
    FOLLOWERS: {
      BASE: ['followers', 'infinite'],
      WITH_PARAMS: (screenName: string) => [...QUERY_KEYS.PROFILE.FOLLOWERS.BASE, screenName],
    },
    FOLLOWING: {
      BASE: ['following', 'infinite'],
      WITH_PARAMS: (screenName: string) => [...QUERY_KEYS.PROFILE.FOLLOWING.BASE, screenName],
    },
  },
} as const;
