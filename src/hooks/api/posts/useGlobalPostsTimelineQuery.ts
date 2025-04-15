import type {
  GlobalPostsTimelineParams,
  GlobalPostsTimelineResponse,
} from '@/app/api/posts/globalTimeline/route';
import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { apiRequest } from '@/db/utils/api';
import { useInfiniteQuery } from '@tanstack/react-query';

type UseGlobalPostsTimelineOptions = {
  limit?: number;
  enabled?: boolean;
};

export const useGlobalPostsTimelineQuery = ({
  limit = 20,
  enabled = true,
}: UseGlobalPostsTimelineOptions = {}) => {
  const result = useInfiniteQuery<GlobalPostsTimelineResponse>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: QUERY_KEYS.POSTS.GLOBAL_TIMELINE,
    queryFn: async ({ pageParam }) =>
      apiRequest(
        'GET',
        API_ENDPOINTS.POSTS.GLOBAL_TIMELINE({
          cursor: pageParam as GlobalPostsTimelineParams['cursor'],
          limit,
        })
      ),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchOnMount: false,
    enabled,
  });

  const flatData = result.data?.pages.flatMap((page) => page.posts) ?? [];

  return {
    ...result,
    flatData,
  };
};
