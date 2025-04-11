'use client';

import Box from '@/components/atoms/Box';
import Loader from '@/components/atoms/Loader';
import FlatList from '@/components/molecules/FlatList/FlatList';
import PostCard from '@/components/molecules/PostCard';
import CreatePostForm from '@/components/organisms/CreatePostForm';
import { useGlobalPostsTimelineQuery } from '@/hooks/api/posts/useGlobalPostsTimelineQuery';
import { useAppSession } from '@/hooks/useAppSession';

export default function Home() {
  const { user } = useAppSession();
  const { flatData, ...restResult } = useGlobalPostsTimelineQuery();

  return (
    <Box className='min-h-screen gap-0'>
      {user && (
        <Box className='hidden gap-0 border-b border-border-1 sm:flex'>
          <CreatePostForm />
        </Box>
      )}
      <FlatList
        data={flatData}
        renderItem={(item) => <PostCard data={item} />}
        infiniteScroll={{
          loader: <Loader className='mt-6' center />,
          emptyMessage: {
            title: 'No posts',
            description: 'No posts found',
          },
          ...restResult,
        }}
      />
    </Box>
  );
}
