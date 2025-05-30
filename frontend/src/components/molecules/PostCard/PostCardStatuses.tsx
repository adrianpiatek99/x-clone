import React, { memo } from 'react';

import Icon from '@/components/atoms/Icon';
import Tooltip from '@/components/atoms/Tooltip';
import Typography from '@/components/atoms/Typography';
import { ROUTES } from '@/constants/routes';
import { MID_DOT } from '@/constants/strings';
import { useTime } from '@/hooks/useTime';
import type { Post } from '@/types/post';
import { useTranslations } from 'next-intl';

type Props = Pick<Post, 'reply' | 'editedAt'> & {
  showReplyStatus?: boolean;
};

export const PostCardStatuses = memo(({ reply, editedAt, showReplyStatus = false }: Props) => {
  const t = useTranslations();
  const { getLocalTime, getFullDate } = useTime();

  return (
    <>
      {showReplyStatus && reply && (
        <Typography color='secondary'>
          Replying to{' '}
          <Typography color='link' href={ROUTES.PROFILE.DETAILS(reply.user.screenName)}>
            @{reply.user.screenName}
          </Typography>
        </Typography>
      )}
      {editedAt && (
        <Tooltip content={`${getLocalTime(editedAt)} ${MID_DOT} ${getFullDate(editedAt)}`}>
          <Typography
            className='inline-flex items-center gap-1 self-start'
            color='secondary'
            size='s'
          >
            <Icon name='EditIcon' className='size-[16px]' /> {t('post.actions.edited')}
          </Typography>
        </Tooltip>
      )}
    </>
  );
});
