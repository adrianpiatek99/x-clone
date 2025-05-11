import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { GetPostLikesParams, GetPostLikesResponse } from '@/types/post';
import { apiRequest } from '@/utils/api';
import { useInfiniteQuery } from '@tanstack/react-query';

type Props = {
  limit?: number;
  enabled?: boolean;
} & Pick<GetPostLikesParams, 'postId'>;

export const useGetPostLikesQuery = ({ postId, limit = 20, enabled = true }: Props) => {
  const result = useInfiniteQuery<GetPostLikesResponse>({
    queryKey: QUERY_KEYS.POSTS.POST_LIKES(postId, limit),
    queryFn: async ({ pageParam }) =>
      apiRequest(
        'GET',
        API_ENDPOINTS.POSTS.POST_LIKES({
          postId,
          cursor: pageParam as GetPostLikesParams['cursor'],
          limit,
        })
      ),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled,
  });

  const flatData = result.data?.pages.flatMap((page) => page.postLikes) ?? [];

  return {
    ...result,
    flatData,
  };
};
