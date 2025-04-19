export const QUERY_KEYS = {
  POSTS: {
    GLOBAL_TIMELINE: ['globalPostsTimeline', 'infinite'],
    POST_LIKES: (id: string, limit: number) => ['postLikes', id, limit, 'infinite'],
    DETAILS: (id: string) => ['postDetails', id],
    TRACK_NEW_POSTS: ['trackNewPosts'],
  },
} as const;
