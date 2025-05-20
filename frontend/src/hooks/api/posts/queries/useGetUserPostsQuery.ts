import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { GetUserPostsParams, GetUserPostsResponse } from '@/types/post';
import { apiRequest } from '@/utils/api';
import { useInfiniteQuery } from '@tanstack/react-query';

type Props = {
  limit?: number;
  enabled?: boolean;
} & Pick<GetUserPostsParams, 'screenName'>;

export const useGetUserPostsQuery = ({ screenName, enabled = true, limit = 30 }: Props) => {
  const result = useInfiniteQuery<GetUserPostsResponse>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: QUERY_KEYS.POSTS.USER_POSTS.WITH_PARAMS(screenName),
    queryFn: async ({ pageParam }) =>
      apiRequest(
        'GET',
        API_ENDPOINTS.POSTS.USER_POSTS({
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
