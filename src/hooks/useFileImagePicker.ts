import type { RefObject } from 'react';
import { type ChangeEvent, useCallback, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';

type Options = { maxSizeMb: number; limit?: number; accept: readonly string[] };

type Props = {
  onSuccess?: (validFiles: File[]) => void;
  onError?: (error: string) => void;
  resetOnSuccess?: boolean;
  options: Options;
};

type FileImagePickerResult = {
  files: File[];
  error: string | undefined;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  openFilePicker: () => void;
  filePickerRef: RefObject<HTMLInputElement | null>;
  reset: () => void;
};

export const useFileImagePicker = ({
  onSuccess,
  onError,
  resetOnSuccess = true,
  options,
}: Props): FileImagePickerResult => {
  const { maxSizeMb, limit = 1, accept } = options;
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

        if (filesArray.length > limit) {
          currentError =
            limit > 1 ? t('errors.file.image.limit', { limit }) : t('errors.file.image.onePhoto');
        } else {
          for (const file of filesArray) {
            if (file) {
              const { type, size } = file;
              const sizeInMB = Number((size / (1024 * 1024)).toFixed(2));

              if (!accept.some((fileType) => fileType === type)) {
                currentError = t('errors.file.invalidType');
                break;
              }

              if (sizeInMB >= maxSizeMb) {
                currentError = t('errors.file.image.maxSize', { maxSize: maxSizeMb });
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
    [t, limit, maxSizeMb, accept, resetInput, reset, onSuccess, onError, resetOnSuccess]
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
