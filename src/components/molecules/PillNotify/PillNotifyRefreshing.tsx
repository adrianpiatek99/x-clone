import React from 'react';

import Loader from '@/components/atoms/Loader';
import Typography from '@/components/atoms/Typography';
import { useTranslations } from 'next-intl';

import PillNotify from './PillNotify';

type Props = {
  isRefetching: boolean;
};

export const PillNotifyRefreshing = ({ isRefetching }: Props) => {
  const t = useTranslations();

  return (
    <PillNotify isVisible={isRefetching}>
      <Loader size='small' />
      <Typography size='xs'>{t('actions.refreshing')}</Typography>
    </PillNotify>
  );
};
