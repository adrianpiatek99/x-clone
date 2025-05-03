import React, { memo } from 'react';

import Icon from '@/components/atoms/Icon';
import IconButton from '@/components/atoms/IconButton';
import ShimmerImage from '@/components/atoms/ShimmerImage';
import { useCheckImageDimensions } from '@/hooks/useCheckImageDimensions';
import { useEditPostStore } from '@/stores/editPost';
import { calcAspectRatio } from '@/utils/aspectRatio';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';
import { useShallow } from 'zustand/shallow';

type Props = { isPending: boolean };

export const EditPostModalMedia = memo(({ isPending }: Props) => {
  const t = useTranslations();
  const { files, removeFile } = useEditPostStore(
    useShallow((state) => ({ files: state.files, removeFile: state.removeFile }))
  );
  const filesCount = files.length;
  const firstFile = files[0]?.file;
  const firstMedia = files[0]?.media;
  const dimensions = useCheckImageDimensions(firstFile);
  const width = firstMedia?.width ?? dimensions.width ?? 0;
  const height = firstMedia?.height ?? dimensions.height ?? 0;
  const { aspectRatio } = calcAspectRatio(width, height);

  return (
    <div className='pb-3'>
      <div
        className={twMerge(
          'relative flex w-full opacity-100 transition duration-200',
          isPending && 'opacity-60'
        )}
      >
        <div
          style={{
            paddingBottom: filesCount >= 2 ? '56.25%' : `${aspectRatio}%`,
          }}
          className='w-full'
        >
          <div className='absolute inset-0 size-full'>
            <div
              style={{ gridTemplateColumns: `repeat(${filesCount >= 3 ? 2 : filesCount}, 1fr)` }}
              className={twMerge(
                'relative grid h-full w-full gap-3',
                filesCount === 3 &&
                  'grid-cols-none [&>div:nth-child(1)]:col-[1] [&>div:nth-child(1)]:row-[1_/_3] [&>div:nth-child(2)]:col-[2] [&>div:nth-child(2)]:row-[1_/_span] [&>div:nth-child(3)]:col-[2] [&>div:nth-child(3)]:row-[1_/_span]'
              )}
            >
              {files.map(({ preview }) => (
                <div
                  key={preview}
                  className='relative size-full animate-appear overflow-hidden rounded-2xl [&>img]:object-cover'
                  aria-label='Media'
                >
                  <ShimmerImage className='object-cover' fill src={preview} alt='Post media' />
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
    </div>
  );
});
