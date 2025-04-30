import type { ComponentPropsWithRef, RefCallback } from 'react';
import React, { memo } from 'react';

import Icon from '@/components/atoms/Icon';
import ShimmerImage from '@/components/atoms/ShimmerImage';
import Typography from '@/components/atoms/Typography';
import { ROUTES } from '@/constants/routes';
import type { Post } from '@/db/schema';
import { useSyntheticEvents } from '@/hooks/useSyntheticEvents';
import { twMerge } from 'tailwind-merge';

type PostMediaGridCardProps = ComponentPropsWithRef<'div'> & {
  post: Post;
  ref?: RefCallback<HTMLDivElement>;
};

const PostMediaGridCard = memo(({ post, className, ...props }: PostMediaGridCardProps) => {
  const {
    id,
    media,
    author: { screenName },
  } = post;
  const { handleOnClick, handleOnKeyUp, handleOnMouseUp } = useSyntheticEvents({
    href: ROUTES.POST.DETAILS(screenName, id),
  });

  return (
    <article
      className={twMerge(
        'relative pb-[100%] cursor-pointer outline-none transition duration-200 focus-visible:bg-text-1/10 focus-visible:ring-focus focus-visible:ring-2 hover:opacity-90',
        className
      )}
      {...props}
      onClick={(e) => handleOnClick(e)}
      onKeyUp={(e) => handleOnKeyUp(e)}
      onMouseUp={(e) => handleOnMouseUp(e)}
      tabIndex={0}
      data-navigable='true'
    >
      <ShimmerImage src={media[0].url} alt={media[0].url} fill className='object-cover' />
      {media.length > 1 && (
        <div className='absolute right-2 top-2 -mr-0.5 -mt-0.5 flex items-center gap-1 rounded-full bg-accent-1/80 px-2 py-0.5 shadow-lg'>
          <Icon name='CarouselIcon' className='size-[20px]' />
          <Typography size='s'>{media.length}</Typography>
        </div>
      )}
    </article>
  );
});

export default PostMediaGridCard;
