import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type {
  GetGlobalTimelineResponse,
  GetPostDetailsResponse,
  GetUserPostsResponse,
} from '@/types/post';
import { apiRequest } from '@/utils/api';
import type { InfiniteQueryData } from '@/utils/queryCache';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

type Props = {
  id: string;
  enabled?: boolean;
};

export const useGetPostDetailsQuery = ({ id, enabled = true }: Props) => {
  const queryClient = useQueryClient();
  const { screenName } = useParams<{ screenName: string }>();
  const { data, isLoading, isFetching, isRefetching, isError } = useQuery<GetPostDetailsResponse>({
    queryKey: QUERY_KEYS.POSTS.DETAILS(id),
    queryFn: () => apiRequest('GET', API_ENDPOINTS.POSTS.DETAILS({ postId: id })),
    enabled: enabled && !!id,
    initialData: () => {
      const globalTimelineState = queryClient.getQueryState(QUERY_KEYS.POSTS.GLOBAL_TIMELINE);

      if (globalTimelineState && Date.now() - globalTimelineState.dataUpdatedAt <= 60 * 1000) {
        const timelineData =
          globalTimelineState.data as InfiniteQueryData<GetGlobalTimelineResponse>;

        const allPosts = timelineData.pages.flatMap((page) => page.posts);

        return allPosts.find((post) => post.id === id);
      }

      if (screenName) {
        const userPostsState = queryClient.getQueryState(
          QUERY_KEYS.POSTS.USER_POSTS.WITH_PARAMS(screenName)
        );

        if (userPostsState && Date.now() - userPostsState.dataUpdatedAt <= 60 * 1000) {
          const userPostsData = userPostsState.data as InfiniteQueryData<GetUserPostsResponse>;

          const allPosts = userPostsData.pages.flatMap((page) => page.posts);

          return allPosts.find((post) => post.id === id);
        }
      }
    },
    staleTime: 30 * 1000, // 30 seconds
  });

  return {
    data,
    isLoading,
    isFetching,
    isRefetching,
    isError,
  };
};
