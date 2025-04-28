import type {
  GetUserPostsParams,
  GetUserPostsResponse,
} from '@/app/api/[screenName]/userPosts/route';
import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { apiRequest } from '@/db/utils/api';
import { useInfiniteQuery } from '@tanstack/react-query';

type UseGlobalPostsTimelineOptions = {
  limit?: number;
  enabled?: boolean;
} & Pick<GetUserPostsParams, 'screenName'>;

export const useGetUserPostsQuery = ({
  screenName,
  enabled = true,
  limit = 30,
}: UseGlobalPostsTimelineOptions) => {
  const result = useInfiniteQuery<GetUserPostsResponse>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: QUERY_KEYS.PROFILE.USER_POSTS(screenName),
    queryFn: async ({ pageParam }) =>
      apiRequest(
        'GET',
        API_ENDPOINTS.PROFILE.USER_POSTS({
          screenName,
          cursor: pageParam as GetUserPostsParams['cursor'],
          limit,
        })
      ),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled,
  });

  const flatData = result.data?.pages.flatMap((page) => page.posts) ?? [];

  return {
    ...result,
    flatData,
  };
};
