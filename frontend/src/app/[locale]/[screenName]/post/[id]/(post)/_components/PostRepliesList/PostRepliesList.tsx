import React from 'react';

import Box from '@/components/atoms/Box';
import Loader from '@/components/atoms/Loader';
import FlatList from '@/components/molecules/FlatList';
import PostCard from '@/components/molecules/PostCard';
import { useGetPostRepliesQuery } from '@/hooks/api/posts/queries/useGetPostRepliesQuery';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import type { PostPageParams } from '../../layout';

const PostRepliesList = () => {
  const t = useTranslations();
  const { id } = useParams<PostPageParams>();
  const { flatData, ...restResult } = useGetPostRepliesQuery({ id });

  return (
    <Box className='border-border-1 border-t'>
      <FlatList
        data={flatData}
        renderItem={(item) => <PostCard className='border-b-0' post={item} />}
        empty={{
          title: t('postPage.replies.empty.title'),
          description: t('postPage.replies.empty.description'),
        }}
        infiniteScroll={{
          loader: (
            <div className='my-6'>
              <Loader center />
            </div>
          ),
          ...restResult,
        }}
      />
    </Box>
  );
};

export default PostRepliesList;
