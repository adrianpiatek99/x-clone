export const ROUTES = {
  HOME: '/',
  EXPLORE: '/explore',
  NOTIFICATIONS: '/notifications',
  MESSAGES: '/messages',
  BOOKMARKS: '/bookmarks',
  SETTINGS: '/settings',
  PROFILE: {
    DETAILS: (screenName: string) => `/${screenName}`,
    REPLIES: (screenName: string) => `/${screenName}/replies`,
    MEDIA: (screenName: string) => `/${screenName}/media`,
    LIKES: (screenName: string) => `/${screenName}/likes`,
    FOLLOWING: (screenName: string) => `/${screenName}/following`,
    FOLLOWERS: (screenName: string) => `/${screenName}/followers`,
  },
  POST: {
    DETAILS: (screenName: string, postId: string) => `/${screenName}/post/${postId}`,
  },
} as const;
