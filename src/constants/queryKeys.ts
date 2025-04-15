export const QUERY_KEYS = {
  POSTS: {
    GLOBAL_TIMELINE: ['globalPostsTimeline', 'infinite'],
    POST_LIKES: (id: string, limit: number) => ['postLikes', id, limit, 'infinite'],
  },
} as const;
