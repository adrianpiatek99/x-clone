import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { apiRequest } from '@/db/utils/api';
import type { GetUserLikesParams, GetUserLikesResponse } from '@/types/post';
import { useInfiniteQuery } from '@tanstack/react-query';

type Props = {
  limit?: number;
  enabled?: boolean;
} & Pick<GetUserLikesParams, 'screenName'>;

export const useGetUserLikesQuery = ({ screenName, enabled = true, limit = 30 }: Props) => {
  const result = useInfiniteQuery<GetUserLikesResponse>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: QUERY_KEYS.POSTS.USER_LIKES(screenName),
    queryFn: async ({ pageParam }) =>
      apiRequest(
        'GET',
        API_ENDPOINTS.POSTS.USER_LIKES({
          screenName,
          cursor: pageParam as GetUserLikesParams['cursor'],
          limit,
        })
      ),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled,
  });

  const flatData = result.data?.pages.flatMap((page) => page.likes) ?? [];

  return {
    ...result,
    flatData,
  };
};
