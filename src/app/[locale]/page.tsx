'use client';

import Box from '@/components/atoms/Box';
import FlatList from '@/components/molecules/FlatList/FlatList';
import PostCard, { PostCardSkeletons } from '@/components/molecules/PostCard';
import CreatePostForm from '@/components/organisms/CreatePostForm';
import { useGlobalPostsTimelineQuery } from '@/hooks/api/posts/useGlobalPostsTimelineQuery';
import { useAppSession } from '@/hooks/useAppSession';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations();
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
        empty={t('homePage.posts.empty')}
        infiniteScroll={{
          loader: <PostCardSkeletons />,
          ...restResult,
        }}
      />
    </Box>
  );
}
