'use client';

import type { PropsWithChildren } from 'react';
import React from 'react';

import Box from '@/components/atoms/Box';

import PostEngagementsHeader from './_components/PostEngagementsHeader';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Box className='gap-0'>
      <PostEngagementsHeader />
      {children}
    </Box>
  );
}
