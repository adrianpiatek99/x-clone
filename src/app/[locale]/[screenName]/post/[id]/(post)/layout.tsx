'use client';

import type { PropsWithChildren } from 'react';
import React from 'react';

import Box from '@/components/atoms/Box';
import HeaderBar from '@/components/molecules/HeaderBar';
import { useTranslations } from 'next-intl';

const Layout = ({ children }: PropsWithChildren) => {
  const t = useTranslations();

  return (
    <Box className='gap-0'>
      <HeaderBar title={t('postPage.title')} showBackButton />
      {children}
    </Box>
  );
};

export default Layout;
