export const QUERY_KEYS = {
  POSTS: {
    GLOBAL_TIMELINE: ['globalTimeline', 'infinite'],
    POST_LIKES: (id: string, limit: number) => ['postLikes', id, limit, 'infinite'] as const,
    DETAILS: (id: string) => ['postDetails', id],
    TRACK_TIMELINE: ['trackTimeline'],
    USER_POSTS: (screenName: string) => ['userPosts', screenName, 'infinite'] as const,
    USER_LIKES: (screenName: string) => ['userLikes', screenName, 'infinite'] as const,
  },
  PROFILE: {
    USER_BY_SCREEN_NAME: (screenName: string) => ['userByScreenName', screenName] as const,
  },
} as const;
