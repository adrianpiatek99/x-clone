import { useCallback, useEffect } from 'react';

import type { GetPostsTrackingParams } from '@/app/api/posts/trackNewPosts/route';
import Icon from '@/components/atoms/Icon';
import PillNotify from '@/components/molecules/PillNotify';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useGetTrackNewPostsQuery } from '@/hooks/api/posts/useGetTrackNewPostsQuery';
import { useHomeStore } from '@/stores/home';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useShallow } from 'zustand/shallow';

type Props = GetPostsTrackingParams & {
  refetch: () => void;
};

const GlobalTrackNewPosts = ({ latestPostId, refetch }: Props) => {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const { enabled, updateGlobal } = useHomeStore(
    useShallow((state) => ({
      enabled: state.global.enableTrackNewPosts,
      updateGlobal: state.updateGlobal,
    }))
  );
  const {
    data: { newPostsCount },
  } = useGetTrackNewPostsQuery({ latestPostId, enabled });

  const enableQuery = useCallback(() => {
    updateGlobal({ enableTrackNewPosts: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = useCallback(() => {
    queryClient.setQueryData(QUERY_KEYS.POSTS.TRACK_NEW_POSTS, { newPostsCount: 0 });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    refetch();
  }, [queryClient, refetch]);

  useEffect(() => {
    window.addEventListener('focus', enableQuery);

    return () => {
      window.removeEventListener('focus', enableQuery);

      enableQuery();
    };
  }, [enableQuery]);

  return (
    <div className='sticky top-[53px] z-[5]'>
      <PillNotify isVisible={newPostsCount > 0} onClick={handleRefresh}>
        <Icon name='RefreshIcon' className='size-[20px]' />
        {!!newPostsCount && t('actions.showPosts', { count: newPostsCount })}
      </PillNotify>
    </div>
  );
};

export default GlobalTrackNewPosts;
