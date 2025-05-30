import type { Ref } from 'react';
import { type ChangeEvent, useCallback, useRef, useState } from 'react';

import type { FileValidationOptions } from '@/constants/validation';
import { useTranslations } from 'next-intl';

type Props = {
  onSuccess?: (validFiles: File[]) => void;
  onError?: (error: string) => void;
  resetOnSuccess?: boolean;
  options: Omit<FileValidationOptions, 'FILE_NAME'>;
};

type FileImagePickerResult = {
  files: File[];
  error: string | undefined;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  openFilePicker: () => void;
  filePickerRef: Ref<HTMLInputElement | null>;
  reset: () => void;
};

export const useFileImagePicker = ({
  onSuccess,
  onError,
  resetOnSuccess = true,
  options,
}: Props): FileImagePickerResult => {
  const { MAX_SIZE_MB, LIMIT = 1, ACCEPT } = options;
  const t = useTranslations();
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

        if (filesArray.length > LIMIT) {
          currentError =
            LIMIT > 1
              ? t('errors.file.image.limit', { limit: LIMIT })
              : t('errors.file.image.onePhoto');
        } else {
          for (const file of filesArray) {
            if (file) {
              const { type, size } = file;
              const sizeInMB = Number((size / (1024 * 1024)).toFixed(2));

              if (!ACCEPT.some((fileType) => fileType === type)) {
                currentError = t('errors.file.invalidType');
                break;
              }

              if (sizeInMB >= MAX_SIZE_MB) {
                currentError = t('errors.file.image.maxSize', { maxSize: MAX_SIZE_MB });
                break;
              }

              validFiles.push(file);
            }
          }
        }

        resetInput();
        setFiles(validFiles);
        setError(currentError);

        if (!!validFiles.length && onSuccess) {
          onSuccess?.(validFiles);

          if (resetOnSuccess) reset();
        }

        if (currentError) onError?.(currentError);
      } else {
        const errorMessage = t('errors.file.somethingWentWrong');

        setError(errorMessage);
        onError?.(errorMessage);
      }
    },
    [t, LIMIT, MAX_SIZE_MB, ACCEPT, resetInput, reset, onSuccess, onError, resetOnSuccess]
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
