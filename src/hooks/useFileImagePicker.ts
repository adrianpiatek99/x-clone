import type { RefObject } from 'react';
import { type ChangeEvent, useCallback, useRef, useState } from 'react';

import { imageFileTypes } from '@/constants/fileTypes';
import { useTranslations } from 'next-intl';

type FileImagePickerOptions = { maxSize?: number; limit?: number };

type FileImagePickerResult = {
  files: File[];
  error: string | undefined;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  openFilePicker: () => void;
  filePickerRef: RefObject<HTMLInputElement | null>;
  reset: () => void;
};

export const useFileImagePicker = (options: FileImagePickerOptions = {}): FileImagePickerResult => {
  const t = useTranslations();
  const { maxSize = 1, limit = 1 } = options;
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);
  const filePickerRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setFiles([]);
    setError(undefined);
  }, []);

  const resetInput = useCallback(() => {
    if (filePickerRef.current) {
      filePickerRef.current.value = '';
    }
  }, []);

  const openFilePicker = useCallback(() => {
    filePickerRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;

      reset();

      if (selectedFiles) {
        const filesArray = Array.from(selectedFiles);
        const validFiles: File[] = [];
        let currentError: string | undefined;

        if (filesArray.length > limit) {
          currentError =
            limit > 1 ? t('errors.file.image.limit', { limit }) : t('errors.file.image.onePhoto');
        } else {
          for (const file of filesArray) {
            if (file) {
              const { type, size } = file;
              const sizeInMB = Number((size / (1024 * 1024)).toFixed(2));

              if (!imageFileTypes.some((fileType) => fileType === type)) {
                currentError = t('errors.file.invalidType');
                break;
              }

              if (sizeInMB >= maxSize) {
                currentError = t('errors.file.image.maxSize', { maxSize });
                break;
              }

              validFiles.push(file);
            }
          }
        }

        resetInput();

        setFiles(validFiles);
        setError(currentError);
      } else {
        setError('errors.file.somethingWrong');
      }
    },
    [t, limit, maxSize, resetInput, reset]
  );

  return {
    files,
    error,
    handleFileChange,
    openFilePicker,
    filePickerRef,
    reset,
  };
};
