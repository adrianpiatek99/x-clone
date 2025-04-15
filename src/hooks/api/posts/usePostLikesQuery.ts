import type { LikesPostParams, LikesPostResponse } from '@/app/api/posts/[id]/likes/route';
import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { apiRequest } from '@/db/utils/api';
import { useInfiniteQuery } from '@tanstack/react-query';

type Props = {
  id: string;
  limit?: number;
  enabled?: boolean;
};

export const usePostLikesQuery = ({ id, limit = 20, enabled = true }: Props) => {
  const result = useInfiniteQuery<LikesPostResponse>({
    queryKey: QUERY_KEYS.POSTS.POST_LIKES(id, limit),
    queryFn: async ({ pageParam }) =>
      apiRequest(
        'GET',
        API_ENDPOINTS.POSTS.POST_LIKES({
          id,
          cursor: pageParam as LikesPostParams['cursor'],
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
