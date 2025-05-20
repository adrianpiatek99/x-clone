import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { GetFollowersParams, GetFollowersResponse } from '@/types/user';
import { apiRequest } from '@/utils/api';
import { useInfiniteQuery } from '@tanstack/react-query';

type Props = {
  limit?: number;
  enabled?: boolean;
} & Pick<GetFollowersParams, 'screenName'>;

export const useGetUserFollowersQuery = ({ limit = 30, enabled = true, screenName }: Props) => {
  const result = useInfiniteQuery<GetFollowersResponse>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: QUERY_KEYS.PROFILE.FOLLOWERS.WITH_PARAMS(screenName),
    queryFn: async ({ pageParam }) =>
      apiRequest(
        'GET',
        API_ENDPOINTS.USERS.FOLLOWERS({
          cursor: pageParam as GetFollowersParams['cursor'],
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
