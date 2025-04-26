'use client';

import type { PropsWithChildren } from 'react';
import React from 'react';

import Box from '@/components/atoms/Box';
import HeaderBar from '@/components/molecules/HeaderBar';
import { useGetPostQuery } from '@/hooks/api/posts/queries';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export type PostParams = {
  id: string;
  screenName: string;
};

const Layout = ({ children }: PropsWithChildren) => {
  const t = useTranslations();
  const { id } = useParams<PostParams>();
  const { isRefetching } = useGetPostQuery({ id });

  return (
    <Box className='gap-0'>
      <HeaderBar title={t('postPage.title')} showBackButton isRefetching={isRefetching} />
      {children}
    </Box>
  );
};

export default Layout;
