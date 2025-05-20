'use client';

import React from 'react';

import FlatList from '@/components/molecules/FlatList';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import type { PostPageParams } from '../../(post)/layout';

export default function PostRespostsPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id } = useParams<PostPageParams>();
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
}
