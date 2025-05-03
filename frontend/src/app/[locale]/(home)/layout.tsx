import type { PropsWithChildren } from 'react';
import React from 'react';

import Box from '@/components/atoms/Box';

import HomeHeader from './_components/HomeHeader';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Box className='gap-0'>
      <HomeHeader />
      {children}
    </Box>
  );
}
