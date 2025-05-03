import type {
  GetUserMediaParams,
  GetUserMediaResponse,
} from '@/app/api/[screenName]/userMedia/route';
import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { apiRequest } from '@/db/utils/api';
import { useInfiniteQuery } from '@tanstack/react-query';

type Props = {
  limit?: number;
  enabled?: boolean;
} & Pick<GetUserMediaParams, 'screenName'>;

export const useGetUserMediaQuery = ({ screenName, enabled = true, limit = 30 }: Props) => {
  const result = useInfiniteQuery<GetUserMediaResponse>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: QUERY_KEYS.POSTS.USER_MEDIA(screenName),
    queryFn: async ({ pageParam }) =>
      apiRequest(
        'GET',
        API_ENDPOINTS.POSTS.USER_MEDIA({
          screenName,
          cursor: pageParam as GetUserMediaParams['cursor'],
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
