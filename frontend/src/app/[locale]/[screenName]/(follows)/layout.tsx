import type { PropsWithChildren } from 'react';

import Box from '@/components/atoms/Box';

import ProfileFollowsHeader from './_components/ProfileFollowsHeader';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Box className='gap-0'>
      <ProfileFollowsHeader />
      {children}
    </Box>
  );
}
