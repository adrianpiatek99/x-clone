'use client';

import type { PropsWithChildren } from 'react';
import React from 'react';

import Box from '@/components/atoms/Box';
import { useGetUserByScreenNameQuery } from '@/hooks/api/profile/queries';
import { useParams } from 'next/navigation';

export type ProfilePageParams = {
  screenName: string;
};

export default function Layout({ children }: PropsWithChildren) {
  const { screenName } = useParams<ProfilePageParams>();

  useGetUserByScreenNameQuery({
    screenName,
  });

  return <Box className='gap-0'>{children}</Box>;
}
