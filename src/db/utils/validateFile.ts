import { ApiError } from './api';

interface FileValidationOptions {
  maxSize: number;
  allowedTypes: string[];
  fieldName: string;
}

export const validateFile = (file: File | null, options: FileValidationOptions) => {
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
  },
  banner: {
    maxSize: 2 * 1024 * 1024,
    fieldName: 'banner',
  },
} as const;
