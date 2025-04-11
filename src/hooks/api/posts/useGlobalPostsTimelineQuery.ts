import type { HomeLatestTimelineResponse } from '@/app/api/posts/globalTimeline/route';
import { API_ENDPOINTS } from '@/db/constants';
import { apiRequest } from '@/db/utils/api';
import { useInfiniteQuery } from '@tanstack/react-query';

type UseHomeLatestTimelineOptions = {
  limit?: number;
  enabled?: boolean;
};

export const useGlobalPostsTimelineQuery = ({
  limit = 20,
  enabled = true,
}: UseHomeLatestTimelineOptions = {}) => {
  const result = useInfiniteQuery<HomeLatestTimelineResponse>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['globalPostsTimeline', 'infinite'],
    queryFn: async ({ pageParam }) =>
      apiRequest(
        'GET',
        API_ENDPOINTS.POSTS.GLOBAL_TIMELINE({
          cursor: pageParam as string,
          limit,
        })
      ),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled,
  });

  const flatData = result.data?.pages.flatMap((page) => page.posts) ?? [];

  return {
    ...result,
    flatData,
  };
};
