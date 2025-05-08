'use client';

import Box from '@/components/atoms/Box';
import { useAuth } from '@/components/context/AuthContext';
import CreatePostForm from '@/components/organisms/CreatePostForm';
import { useAppSession } from '@/hooks/useAppSession';
import { HomeTab, useHomeStore } from '@/stores/home';

import FollowingPostsTimeline from './_components/FollowingPostsTimeline';
import GlobalPostsTimeline from './_components/GlobalPostsTimeline';

export default function HomePage() {
  const { user } = useAppSession();
  const currentTab = useHomeStore((state) => state.currentTab);
  const { user: authUser } = useAuth();

  console.log('authUser', authUser);

  return (
    <>
      {user && (
        <Box className='border-border-1 hidden gap-0 border-b sm:flex'>
          <CreatePostForm />
        </Box>
      )}
      {currentTab === HomeTab.GLOBAL && <GlobalPostsTimeline />}
      {currentTab === HomeTab.FOLLOWING && <FollowingPostsTimeline />}
    </>
  );
}
