'use client';

import Box from '@/components/atoms/Box';
import { useAuth } from '@/components/context/AuthContext';
import CreatePostForm from '@/components/organisms/CreatePostForm';
import { HomeTab, useHomeStore } from '@/stores/home';

import FollowingPostsTimeline from './_components/FollowingPostsTimeline';
import GlobalPostsTimeline from './_components/GlobalPostsTimeline';

export default function HomePage() {
  const { user } = useAuth();
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
