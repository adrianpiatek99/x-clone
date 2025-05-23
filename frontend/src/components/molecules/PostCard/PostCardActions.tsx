import React, { memo, useState } from 'react';

import Box from '@/components/atoms/Box';
import Icon from '@/components/atoms/Icon';
import IconButton from '@/components/atoms/IconButton';
import { useToggleLikePostMutation } from '@/hooks/api/posts/mutations';
import type { Post } from '@/types/post';
import { formatNumber } from '@/utils/formatNumber';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

const LazyReplayPostModal = dynamic(() => import('@/components/organisms/ReplayPostModal'));

type Props = {
  post: Post;
};

export const PostCardActions = memo(({ post }: Props) => {
  const { id, isLiked, likesCount } = post;
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  const { toggleLikePost, isToggleLikePending } = useToggleLikePostMutation();
  const likeTitle = isLiked ? t('post.actions.unlike') : t('post.actions.like');

  const handleToggleLike = () => toggleLikePost(id, isLiked);

  return (
    <Box className='-ml-3 w-full min-w-[200px] max-w-[425px] flex-row flex-wrap items-center'>
      <IconButton
        onClick={() => setIsOpen(true)}
        title={t('post.actions.reply')}
        label={formatNumber(0)}
        color='secondary'
      >
        <Icon name='MessageIcon' />
      </IconButton>
      <IconButton
        className={twMerge(
          'bg-pink/0 text-text-2 enabled:hover:text-pink focus-visible:text-pink focus-visible:bg-pink/10 enabled:hover:bg-pink/10 enabled:active:bg-pink/20',
          isLiked && 'text-pink'
        )}
        onClick={handleToggleLike}
        title={likeTitle}
        label={formatNumber(likesCount)}
        disabled={isToggleLikePending}
      >
        {isLiked ? <Icon name='HeartIcon' /> : <Icon name='HeartOutlinedIcon' />}
      </IconButton>

      <LazyReplayPostModal isOpen={isOpen} onClose={() => setIsOpen(false)} post={post} />
    </Box>
  );
});
