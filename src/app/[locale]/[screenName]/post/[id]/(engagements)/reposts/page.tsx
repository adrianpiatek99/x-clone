'use client';

import React from 'react';

import FlatList from '@/components/molecules/FlatList';
import { useTranslations } from 'next-intl';

type ParamsType = {
  screenName: string;
  id: string;
};

type Props = {
  params: Promise<ParamsType>;
};

const PostRespostsPage = ({ params }: Props) => {
  const unwrappedParams = React.use(params);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id } = unwrappedParams;
  const t = useTranslations();

  return (
    <div>
      <FlatList
        data={[]}
        renderItem={() => <div />}
        empty={{
          title: t('postPage.reposts.empty.title'),
          description: t('postPage.reposts.empty.description'),
        }}
      />
    </div>
  );
};

export default PostRespostsPage;
