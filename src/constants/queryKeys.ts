export const QUERY_KEYS = {
  POSTS: {
    GLOBAL_TIMELINE: ['globalTimeline', 'infinite'],
    POST_LIKES: (id: string, limit: number) => ['postLikes', id, limit, 'infinite'],
    DETAILS: (id: string) => ['postDetails', id],
    TRACK_TIMELINE: ['trackTimeline'],
  },
  PROFILE: {
    USER_BY_SCREEN_NAME: (screenName: string) => ['userByScreenName', screenName],
  },
} as const;
