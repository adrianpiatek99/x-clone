import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { GetPostRepliesParams, GetPostRepliesResponse } from '@/types/post';
import { apiRequest } from '@/utils/api';
import { useInfiniteQuery } from '@tanstack/react-query';

type Props = {
  id: string;
  limit?: number;
  enabled?: boolean;
};

export const useGetPostRepliesQuery = ({ id, limit = 30, enabled = true }: Props) => {
  const result = useInfiniteQuery<GetPostRepliesResponse>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: QUERY_KEYS.POSTS.POST_REPLIES.WITH_PARAMS(id),
    queryFn: async ({ pageParam }) =>
      apiRequest(
        'GET',
        API_ENDPOINTS.POSTS.POST_REPLIES({
          postId: id,
          cursor: pageParam as GetPostRepliesParams['cursor'],
          limit,
        })
      ),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled,
  });

  const flatData = result.data?.pages.flatMap((page) => page.postReplies) ?? [];

  return {
    ...result,
    flatData,
  };
};
