import { useCallback, useEffect } from 'react';

import type { GetPostsTrackingParams } from '@/app/api/posts/trackNewPosts/route';
import PillNotify from '@/components/molecules/PillNotify';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useGetTrackNewPostsQuery } from '@/hooks/api/posts/useGetTrackNewPostsQuery';
import { RefreshIcon } from '@/icons';
import { useHomeStore } from '@/stores/home';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useShallow } from 'zustand/shallow';

type Props = GetPostsTrackingParams & {
  refetch: () => void;
};

const TrackNewPosts = ({ latestPostId, refetch }: Props) => {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const { enabled, update } = useHomeStore(
    useShallow((state) => ({
      enabled: state.enableTrackNewPosts,
      update: state.update,
    }))
  );
  const {
    data: { newPostsCount },
  } = useGetTrackNewPostsQuery({ latestPostId, enabled });

  const enableQuery = useCallback(() => {
    update({ enableTrackNewPosts: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = useCallback(() => {
    queryClient.setQueryData(QUERY_KEYS.POSTS.TRACK_NEW_POSTS, { newPostsCount: 0 });

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
    <PillNotify isVisible={newPostsCount > 0} onClick={handleRefresh}>
      <RefreshIcon className='size-[20px]' />
      {!!newPostsCount && t('actions.showPosts', { count: newPostsCount })}
    </PillNotify>
  );
};

export default TrackNewPosts;
