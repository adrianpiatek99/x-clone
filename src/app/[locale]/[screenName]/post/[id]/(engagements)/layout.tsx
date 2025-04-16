'use client';

import type { PropsWithChildren } from 'react';
import React from 'react';

import Box from '@/components/atoms/Box';

import PostEngagementsHeader from './_components/PostEngagementsHeader';

type Params = {
  screenName: string;
  id: string;
};

type Props = {
  params: Promise<Params>;
};

const PostEngagementsLayout = ({ children, params }: PropsWithChildren<Props>) => {
  const unwrappedParams = React.use(params);

  return (
    <Box className='gap-0'>
      <PostEngagementsHeader params={unwrappedParams} />
      {children}
    </Box>
  );
};

export default PostEngagementsLayout;
