import React from 'react';

import Icon from '@/components/atoms/Icon';
import IconButton from '@/components/atoms/IconButton';
import { ROUTES } from '@/constants/routes';
import { useRouter } from '@/i18n/routing';
import { useGlobalStore } from '@/stores/global';
import { useTranslations } from 'next-intl';

export const HeaderBarBackButton = () => {
  const t = useTranslations();
  const router = useRouter();
  const previousPathname = useGlobalStore((state) => state.previousPathname);

  const handleBack = () => (previousPathname ? router.back() : router.replace(ROUTES.HOME));

  return (
    <IconButton className='-ml-2' color='white' title={t('actions.back')} onClick={handleBack}>
      <Icon name='ArrowBackIcon' />
    </IconButton>
  );
};
