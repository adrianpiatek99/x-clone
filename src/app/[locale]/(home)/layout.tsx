import type { PropsWithChildren } from 'react';
import React from 'react';

import Box from '@/components/atoms/Box';

import HomeHeader from './_components/HomeHeader';

const HomeLayout = ({ children }: PropsWithChildren) => {
  return (
    <Box className='min-h-screen gap-0'>
      <HomeHeader />
      {children}
    </Box>
  );
};

export default HomeLayout;
