import React, { memo } from 'react';

import ShimmerImage from '@/components/atoms/ShimmerImage';
import type { Post } from '@/types/post';
import { calcAspectRatio } from '@/utils/aspectRatio';
import { twMerge } from 'tailwind-merge';

type Props = Pick<Post, 'media'>;

export const PostCardMedia = memo(({ media }: Props) => {
  const mediaCount = media.length;
  const width = media[0]?.width ?? 0;
  const height = media[0]?.height ?? 0;
  const { aspectRatio, ratioWidth, ratioHeight } = calcAspectRatio(width, height);

  return (
    <div
      className='relative flex w-full overflow-hidden rounded-2xl border border-border-1'
      style={{
        maxWidth: aspectRatio > 110 && mediaCount === 1 ? `${ratioWidth}px` : '100%',
        maxHeight: aspectRatio > 110 && mediaCount === 1 ? `${ratioHeight}px` : '100%',
      }}
    >
      <div
        style={{
          paddingBottom: mediaCount >= 2 ? '56.25%' : `${aspectRatio}%`,
        }}
        className='w-full'
      >
        <div className='absolute inset-0 size-full'>
          <div
            style={{ gridTemplateColumns: `repeat(${mediaCount >= 3 ? 2 : mediaCount}, 1fr)` }}
            className={twMerge(
              'relative grid h-full w-full gap-0.5',
              mediaCount === 3 &&
                'grid-cols-none [&>div:nth-child(1)]:col-[1] [&>div:nth-child(1)]:row-[1_/_3] [&>div:nth-child(2)]:col-[2] [&>div:nth-child(2)]:row-[1_/_span] [&>div:nth-child(3)]:col-[2] [&>div:nth-child(3)]:row-[1_/_span]'
            )}
          >
            {media.map(({ url }) => (
              <div key={url} className='relative size-full'>
                <ShimmerImage className='object-cover' fill src={url} alt='Post media' />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
