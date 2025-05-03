import { gifFileTypes, imageFileTypes } from '@/constants/fileTypes';
import { VALIDATION } from '@/constants/validation';

import { ApiError } from './api';

type Options = {
  fieldName: string;
  maxSizeMb: number;
  accept: readonly string[];
  limit?: number;
};

export const validateFile = (file: File | null | undefined, options: Options) => {
  if (!file) return;

  const { maxSizeMb, accept, fieldName } = options;
  const maxSize = maxSizeMb * 1024 * 1024;

  if (!accept.includes(file.type) || file.size > maxSize) {
    throw new ApiError(
      `Invalid ${fieldName} format or size. File must be ${accept.join(', ')} and under ${
        maxSize / 1024 / 1024
      }MB`,
      400
    );
  }
};

export const fileValidationConfigs = {
  avatar: {
    fieldName: 'avatar',
    maxSizeMb: VALIDATION.ACCOUNT.AVATAR.MAX_SIZE_MB,
    accept: imageFileTypes,
  },
  banner: {
    fieldName: 'banner',
    maxSizeMb: VALIDATION.ACCOUNT.BANNER.MAX_SIZE_MB,
    accept: [...imageFileTypes, ...gifFileTypes],
  },
  media: {
    fieldName: 'media',
    maxSizeMb: VALIDATION.POST.MEDIA.MAX_SIZE_MB,
    accept: imageFileTypes,
    limit: VALIDATION.POST.MEDIA.LIMIT,
  },
} satisfies Record<string, Options>;
