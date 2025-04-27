import React from 'react';

import Icon from '@/components/atoms/Icon';
import Tooltip from '@/components/atoms/Tooltip';
import Typography from '@/components/atoms/Typography';
import { MID_DOT } from '@/constants/strings';
import type { Post } from '@/db/schema';
import { useTime } from '@/hooks/useTime';
import { useTranslations } from 'next-intl';

type Props = Pick<Post, 'editedAt'>;

export const PostCardStatuses = ({ editedAt }: Props) => {
  const t = useTranslations();
  const { getLocalTime, getFullDate } = useTime();

  return (
    <>
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
};
