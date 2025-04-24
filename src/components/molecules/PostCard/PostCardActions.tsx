import React from 'react';

import Box from '@/components/atoms/Box';
import Icon from '@/components/atoms/Icon';
import IconButton from '@/components/atoms/IconButton';
import type { Post } from '@/db/schema';
import { useToggleLikePostMutation } from '@/hooks/api/posts/useToggleLikePostMutation';
import { formatNumber } from '@/utils/formatNumber';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

type Props = Pick<Post, 'id' | 'isLiked' | 'likesCount'>;

export const PostCardActions = ({ id, isLiked, likesCount }: Props) => {
  const t = useTranslations();
  const { toggleLikePost, isToggleLikePending } = useToggleLikePostMutation();
  const likeTitle = isLiked ? t('post.actions.unlike') : t('post.actions.like');

  const handleToggleLike = () => toggleLikePost(id, isLiked);

  return (
    <Box className='-ml-3 w-full min-w-[200px] max-w-[425px] flex-row items-center'>
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
    </Box>
  );
};
