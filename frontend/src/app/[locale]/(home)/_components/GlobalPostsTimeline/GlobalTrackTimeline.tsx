import { useCallback, useEffect } from 'react';

import Icon from '@/components/atoms/Icon';
import PillNotify from '@/components/molecules/PillNotify';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useGetTrackTimelineQuery } from '@/hooks/api/posts/queries';
import { useHomeStore } from '@/stores/home';
import type { GetTrackTimelineParams, GetTrackTimelineResponse } from '@/types/post';
import { formatNumber } from '@/utils/formatNumber';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useShallow } from 'zustand/shallow';

type Props = GetTrackTimelineParams & {
  refetch: () => void;
};

const GlobalTrackTimeline = ({ latestPostId, refetch }: Props) => {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const { enabled, updateGlobal } = useHomeStore(
    useShallow((state) => ({
      enabled: state.global.enableTrackTimeline,
      updateGlobal: state.updateGlobal,
    }))
  );
  const {
    data: { newPostsCount },
  } = useGetTrackTimelineQuery({ latestPostId, enabled });

  const enableQuery = useCallback(() => {
    updateGlobal({ enableTrackTimeline: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = useCallback(() => {
    queryClient.setQueryData<GetTrackTimelineResponse>(QUERY_KEYS.POSTS.TRACK_TIMELINE, {
      newPostsCount: 0,
    });

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
    <PillNotify isVisible={newPostsCount > 0} onClick={handleRefresh}>
      <Icon name='RefreshIcon' className='size-[20px]' />
      {!!newPostsCount && t('actions.showPosts', { count: formatNumber(newPostsCount) })}
    </PillNotify>
  );
};

export default GlobalTrackTimeline;
