import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { GetFollowingParams, GetFollowingResponse } from '@/types/user';
import { apiRequest } from '@/utils/api';
import { useInfiniteQuery } from '@tanstack/react-query';

type Props = {
  limit?: number;
  enabled?: boolean;
} & Pick<GetFollowingParams, 'screenName'>;

export const useGetUserFollowingQuery = ({ limit = 30, enabled = true, screenName }: Props) => {
  const result = useInfiniteQuery<GetFollowingResponse>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: QUERY_KEYS.PROFILE.FOLLOWING(screenName),
    queryFn: async ({ pageParam }) =>
      apiRequest(
        'GET',
        API_ENDPOINTS.USERS.FOLLOWING({
          cursor: pageParam as GetFollowingParams['cursor'],
          limit,
          screenName,
        })
      ),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled,
  });

  const flatData = result.data?.pages.flatMap((page) => page.users) ?? [];

  return {
    ...result,
    flatData,
  };
};
