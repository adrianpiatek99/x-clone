'use client';

import Box from '@/components/atoms/Box';
import CreatePostForm from '@/components/organisms/CreatePostForm';
import { useAppSession } from '@/hooks/useAppSession';
import { HomeTab, useHomeStore } from '@/stores/home';

import FollowingPostsTimeline from './_components/FollowingPostsTimeline';
import GlobalPostsTimeline from './_components/GlobalPostsTimeline';

export default function Home() {
  const { user } = useAppSession();
  const currentTab = useHomeStore((state) => state.currentTab);

  return (
    <>
      {user && (
        <Box className='hidden gap-0 border-b border-border-1 sm:flex'>
          <CreatePostForm />
        </Box>
      )}
      {currentTab === HomeTab.GLOBAL && <GlobalPostsTimeline />}
      {currentTab === HomeTab.FOLLOWING && <FollowingPostsTimeline />}
    </>
  );
}
