import React from 'react';

import IconButton from '@/components/atoms/IconButton';
import { MoreHorizontalIcon } from '@/icons';
import { useTranslations } from 'next-intl';

export const PostCardDropdown = () => {
  const t = useTranslations();

  return (
    <div className='my-[-8px] mr-[-6px] flex items-center'>
      <IconButton title={t('post.actions.more')} color='secondary'>
        <MoreHorizontalIcon />
      </IconButton>
    </div>
  );
};
