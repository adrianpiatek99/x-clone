import { gifFileTypes, imageFileTypes } from './fileTypes';

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
    MAX_SIZE_MB: 3,
  },
  TEXT: {
    MAX: 500,
  },
  REPLY: {
    MAX: 400,
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

// File validation options
export type FileValidationOptions = {
  FILE_NAME: string;
  MAX_SIZE_MB: number;
  ACCEPT: readonly string[];
  LIMIT?: number;
};

export const FILE_VALIDATION_CONFIGS = {
  AVATAR: {
    FILE_NAME: 'avatar',
    MAX_SIZE_MB: VALIDATION.ACCOUNT.AVATAR.MAX_SIZE_MB,
    ACCEPT: imageFileTypes,
  },
  BANNER: {
    FILE_NAME: 'banner',
    MAX_SIZE_MB: VALIDATION.ACCOUNT.BANNER.MAX_SIZE_MB,
    ACCEPT: [...imageFileTypes, ...gifFileTypes],
  },
  MEDIA: {
    FILE_NAME: 'media',
    MAX_SIZE_MB: VALIDATION.POST.MEDIA.MAX_SIZE_MB,
    ACCEPT: imageFileTypes,
    LIMIT: VALIDATION.POST.MEDIA.LIMIT,
  },
} satisfies Record<string, FileValidationOptions>;
