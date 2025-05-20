'use client';

import type { PropsWithChildren } from 'react';
import React from 'react';

import Box from '@/components/atoms/Box';
import { useGetUserByScreenNameQuery } from '@/hooks/api/profile/queries';

export type ProfilePageParams = {
  screenName: string;
};

export default function Layout({ children }: PropsWithChildren) {
  useGetUserByScreenNameQuery();

  return <Box className='gap-0'>{children}</Box>;
}
