import { imageFileTypes } from '@/constants/fileTypes';
import { VALIDATION } from '@/constants/validation';

import { ApiError } from './api';

type Options = {
  maxSize: number;
  allowedTypes: string[];
  fieldName: string;
};

export const validateFile = (file: File | null, options: Options) => {
  if (!file) return;

  const { maxSize, allowedTypes, fieldName } = options;

  if (!allowedTypes.includes(file.type) || file.size > maxSize) {
    throw new ApiError(
      `Invalid ${fieldName} format or size. File must be ${allowedTypes.join(', ')} and under ${
        maxSize / 1024 / 1024
      }MB`,
      400
    );
  }
};

export const fileValidationConfigs = {
  avatar: {
    maxSize: VALIDATION.ACCOUNT.AVATAR.MAX_SIZE * 1024 * 1024,
    fieldName: 'avatar',
    allowedTypes: imageFileTypes,
  },
  banner: {
    maxSize: VALIDATION.ACCOUNT.BANNER.MAX_SIZE * 1024 * 1024,
    fieldName: 'banner',
    allowedTypes: imageFileTypes,
  },
  media: {
    maxSize: VALIDATION.POST.MEDIA.MAX_SIZE * 1024 * 1024,
    fieldName: 'media',
    allowedTypes: imageFileTypes,
  },
} as const;
