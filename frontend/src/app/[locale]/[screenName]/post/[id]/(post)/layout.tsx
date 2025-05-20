'use client';

import type { PropsWithChildren } from 'react';
import React from 'react';

import Box from '@/components/atoms/Box';
import HeaderBar from '@/components/molecules/HeaderBar';
import { useGetPostDetailsQuery } from '@/hooks/api/posts/queries';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import type { ProfilePageParams } from '../../../layout';

export type PostPageParams = {
  id: string;
} & ProfilePageParams;

const Layout = ({ children }: PropsWithChildren) => {
  const t = useTranslations();
  const { id } = useParams<PostPageParams>();
  const { isRefetching } = useGetPostDetailsQuery({ id });

  return (
    <Box className='gap-0'>
      <HeaderBar title={t('postPage.title')} showBackButton isRefetching={isRefetching} />
      {children}
    </Box>
  );
};

export default Layout;
