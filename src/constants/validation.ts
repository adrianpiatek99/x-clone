type Validation = Record<
  string,
  Partial<{
    MIN: number;
    MAX: number;
    LIMIT: number;
    MAX_SIZE_MB: number;
  }>
>;

const postValidation = {
  MEDIA: {
    LIMIT: 4,
    MAX_SIZE_MB: 2.5,
  },
  TEXT: {
    MAX: 500,
  },
} satisfies Validation;

const accountValidation = {
  NAME: {
    MIN: 4,
    MAX: 50,
  },
  SCREEN_NAME: {
    MIN: 4,
    MAX: 15,
  },
  DESCRIPTION: {
    MAX: 160,
  },
  EMAIL: {
    MAX: 100,
  },
  PASSWORD: {
    MIN: 6,
    MAX: 32,
  },
  WEBSITE: {
    MAX: 100,
  },
  AVATAR: {
    MAX_SIZE_MB: 1,
  },
  BANNER: {
    MAX_SIZE_MB: 2,
  },
} satisfies Validation;

export const VALIDATION = {
  POST: postValidation,
  ACCOUNT: accountValidation,
} as const;
