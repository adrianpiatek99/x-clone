export const ROUTES = {
  HOME: '/',
  EXPLORE: '/explore',
  NOTIFICATIONS: '/notifications',
  MESSAGES: '/messages',
  BOOKMARKS: '/bookmarks',
  SETTINGS: '/settings',
  PROFILE: {
    DETAILS: (screenName: string) => `/${screenName}` as const,
    REPLIES: (screenName: string) => `/${screenName}/replies` as const,
    MEDIA: (screenName: string) => `/${screenName}/media` as const,
    LIKES: (screenName: string) => `/${screenName}/likes` as const,
    FOLLOWING: (screenName: string) => `/${screenName}/following` as const,
    FOLLOWERS: (screenName: string) => `/${screenName}/followers` as const,
  },
  POST: {
    DETAILS: (screenName: string, postId: string) => `/${screenName}/post/${postId}` as const,
    LIKES: (screenName: string, postId: string) => `/${screenName}/post/${postId}/likes` as const,
    REPOSTS: (screenName: string, postId: string) =>
      `/${screenName}/post/${postId}/reposts` as const,
  },
} as const;
