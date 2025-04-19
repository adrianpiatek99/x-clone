import type { GetPostResponse } from '@/app/api/posts/[id]/route';
import type { GetGlobalTimelineResponse } from '@/app/api/posts/globalTimeline/route';
import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { apiRequest } from '@/db/utils/api';
import type { InfiniteQueryData } from '@/utils/queryCache';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type Props = {
  id: string;
};

export const useGetPostQuery = ({ id }: Props) => {
  const queryClient = useQueryClient();
  const { data, isLoading, isFetching, isRefetching, isError } = useQuery<GetPostResponse>({
    queryKey: QUERY_KEYS.POSTS.DETAILS(id),
    queryFn: () => apiRequest('GET', API_ENDPOINTS.POSTS.DETAILS({ id })),
    enabled: !!id,
    initialData: () => {
      const state = queryClient.getQueryState(QUERY_KEYS.POSTS.GLOBAL_TIMELINE);

      if (state && Date.now() - state.dataUpdatedAt <= 60 * 1000) {
        const timelineData = state.data as InfiniteQueryData<GetGlobalTimelineResponse>;

        const allPosts = timelineData.pages.flatMap((page) => page.posts);

        return allPosts.find((post) => post.id === id);
      }
    },
  });

  return {
    data,
    isLoading,
    isFetching,
    isRefetching,
    isError,
  };
};
