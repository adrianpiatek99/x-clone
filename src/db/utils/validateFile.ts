import { imageFileTypes } from '@/constants/fileTypes';
import { POST_MEDIA_SIZE_MB_LIMIT } from '../constants';
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
    maxSize: 1 * 1024 * 1024,
    fieldName: 'avatar',
    allowedTypes: imageFileTypes,
  },
  banner: {
    maxSize: 2 * 1024 * 1024,
    fieldName: 'banner',
    allowedTypes: imageFileTypes,
  },
  media: {
    maxSize: POST_MEDIA_SIZE_MB_LIMIT * 1024 * 1024,
    fieldName: 'media',
    allowedTypes: imageFileTypes,
  },
} as const;
