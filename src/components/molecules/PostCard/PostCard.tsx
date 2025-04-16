import type { ComponentPropsWithRef, RefCallback } from 'react';
import React, { memo, useState } from 'react';

import Avatar from '@/components/atoms/Avatar';
import Box from '@/components/atoms/Box';
import { ROUTES } from '@/constants/routes';
import type { Post } from '@/db/schema';
import { useSyntheticEvents } from '@/hooks/useSyntheticEvents';
import { twMerge } from 'tailwind-merge';

import { PostCardActions } from './PostCardActions';
import { PostCardAuthor } from './PostCardAuthor';
import { PostCardDropdown } from './PostCardDropdown';
import { PostCardMedia } from './PostCardMedia';
import { PostCardText } from './PostCardText';

type Props = ComponentPropsWithRef<'div'> & {
  post: Post;
  ref?: RefCallback<HTMLDivElement>;
};

const PostCard = memo(({ post, className, ...props }: Props) => {
  const { id, text, author, media, createdAt, isAuthor, isLiked, likesCount } = post;
  const { avatarUrl, screenName } = author;
  const [isLoading, setIsLoading] = useState(false);
  const { handleOnClick, handleOnKeyUp, handleOnMouseUp } = useSyntheticEvents({
    href: ROUTES.POST.DETAILS(screenName, id),
  });

  return (
    <Box
      as='article'
      className={twMerge(
        'cursor-pointer border-b border-border-1 px-4 py-3 outline-none transition duration-200 focus-visible:bg-text-1/10 ring-inset focus-visible:ring-focus focus-visible:ring-2',
        isLoading ? 'pointer-events-none' : 'hover:bg-text-1/5',
        className
      )}
      {...props}
      onClick={handleOnClick}
      onKeyUp={handleOnKeyUp}
      onMouseUp={handleOnMouseUp}
      tabIndex={0}
      data-navigable='true'
    >
      <Box className={twMerge('relative flex-row items-start', isLoading && 'opacity-50')}>
        <Avatar href={ROUTES.PROFILE.DETAILS(screenName)} src={avatarUrl} screenName={screenName} />
        <Box className='grow gap-1'>
          <PostCardAuthor id={id} author={author} createdAt={createdAt}>
            <PostCardDropdown
              id={id}
              author={author}
              isAuthor={isAuthor}
              setIsLoading={setIsLoading}
            />
          </PostCardAuthor>
          <Box className='mt-0.5'>
            <PostCardText id={id} text={text} author={author} />
            {!!media.length && <PostCardMedia media={media} />}
            <PostCardActions id={id} isLiked={isLiked} likesCount={likesCount} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

export default PostCard;
