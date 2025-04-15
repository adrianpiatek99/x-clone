'use client';

import React from 'react';

import Loader from '@/components/atoms/Loader';
import FlatList from '@/components/molecules/FlatList';
import ProfileCard from '@/components/molecules/ProfileCard';
import { usePostLikesQuery } from '@/hooks/api/posts/usePostLikesQuery';
import { useTranslations } from 'next-intl';

type ParamsType = {
  screenName: string;
  id: string;
};

type Props = {
  params: Promise<ParamsType>;
};

const PostLikesPage = ({ params }: Props) => {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  const t = useTranslations();
  const { flatData, ...restResult } = usePostLikesQuery({ id });

  return (
    <FlatList
      data={flatData}
      renderItem={(item) => <ProfileCard user={item.user} />}
      empty={{
        title: t('postPage.likes.empty.title'),
        description: t('postPage.likes.empty.description'),
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
  );
};

export default PostLikesPage;
