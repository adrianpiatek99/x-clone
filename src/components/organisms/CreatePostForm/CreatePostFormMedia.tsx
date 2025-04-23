import React, { memo } from 'react';

import Icon from '@/components/atoms/Icon';
import IconButton from '@/components/atoms/IconButton';
import { useCheckImageDimensions } from '@/hooks/useCheckImageDimensions';
import type { CreatePostStore } from '@/stores/createPost';
import { calcAspectRatio } from '@/utils/aspectRatio';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

type Props = Pick<CreatePostStore, 'files' | 'removeFile'> & {
  isPending: boolean;
};

export const CreatePostFormMedia = memo(({ isPending, files, removeFile }: Props) => {
  const t = useTranslations();
  const firstFile = files[0]?.file;
  const { width, height } = useCheckImageDimensions(firstFile);
  const { aspectRatio } = calcAspectRatio(width, height);
  const fileCount = files.length;

  return (
    <div className='pb-3'>
      <div
        className={twMerge(
          'relative flex w-full opacity-100 transition duration-200',
          isPending && 'opacity-60'
        )}
        style={{
          paddingBottom: fileCount >= 2 ? '56.25%' : `${aspectRatio >= 125 ? 125 : aspectRatio}%`,
        }}
      >
        <div className='absolute inset-0 size-full'>
          <div
            style={{ gridTemplateColumns: `repeat(${fileCount >= 3 ? 2 : fileCount}, 1fr)` }}
            className={twMerge(
              'relative grid h-full w-full gap-3',
              fileCount === 3 &&
                'grid-cols-none [&>div:nth-child(1)]:col-[1] [&>div:nth-child(1)]:row-[1_/_3] [&>div:nth-child(2)]:col-[2] [&>div:nth-child(2)]:row-[1_/_span] [&>div:nth-child(3)]:col-[2] [&>div:nth-child(3)]:row-[1_/_span]'
            )}
          >
            {files.map(({ file, preview }) => (
              <div
                key={preview}
                className='relative size-full animate-appear overflow-hidden rounded-2xl [&>img]:object-cover'
                aria-label='Media'
              >
                <Image fill src={preview} alt={file.name} />
                {!isPending && (
                  <IconButton
                    className='absolute right-1 top-1'
                    title={t('actions.remove')}
                    color='darker'
                    onClick={() => removeFile(preview)}
                  >
                    <Icon name='CloseIcon' />
                  </IconButton>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
