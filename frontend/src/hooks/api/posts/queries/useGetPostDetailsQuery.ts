import { useEffect } from 'react';

import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type {
  GetGlobalTimelineResponse,
  GetPostDetailsResponse,
  GetPostRepliesResponse,
  GetUserPostsResponse,
} from '@/types/post';
import { apiRequest } from '@/utils/api';
import { compareQueryKeys, type InfiniteQueryData } from '@/utils/queryCache';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

type Props = {
  id: string;
  enabled?: boolean;
};

export const useGetPostDetailsQuery = ({ id, enabled = true }: Props) => {
  const queryClient = useQueryClient();
  const { screenName } = useParams<{ screenName: string }>();
  const {
    data = { posts: [] },
    isLoading,
    isFetching,
    isRefetching,
    refetch,
    isError,
  } = useQuery<GetPostDetailsResponse>({
    queryKey: QUERY_KEYS.POSTS.DETAILS.WITH_PARAMS(id),
    queryFn: () => apiRequest('GET', API_ENDPOINTS.POSTS.DETAILS({ postId: id })),
    enabled: enabled && !!id,
    refetchOnMount: false,
    initialData: () => {
      const globalTimelineState = queryClient.getQueryState(QUERY_KEYS.POSTS.GLOBAL_TIMELINE.BASE);
      const postRepliesState = queryClient.getQueriesData<
        InfiniteQueryData<GetPostRepliesResponse>
      >({
        predicate: (query) => compareQueryKeys(query.queryKey, QUERY_KEYS.POSTS.POST_REPLIES.BASE),
      });

      if (postRepliesState.length) {
        const foundReply = postRepliesState
          .flatMap((entry) => entry[1]?.pages ?? [])
          .flatMap((page) => page.postReplies ?? [])
          .find((reply) => reply.id === id);

        if (foundReply) {
          return { posts: [foundReply] };
        }
      }

      if (globalTimelineState && Date.now() - globalTimelineState.dataUpdatedAt <= 60 * 1000) {
        const timelineData =
          globalTimelineState.data as InfiniteQueryData<GetGlobalTimelineResponse>;

        const allPosts = timelineData.pages.flatMap((page) => page.posts);

        const post = allPosts.find((post) => post.id === id);

        if (post) {
          return { posts: [post] };
        }

        return undefined;
      }

      if (screenName) {
        const userPostsState = queryClient.getQueryState(
          QUERY_KEYS.POSTS.USER_POSTS.WITH_PARAMS(screenName)
        );

        if (userPostsState && Date.now() - userPostsState.dataUpdatedAt <= 60 * 1000) {
          const userPostsData = userPostsState.data as InfiniteQueryData<GetUserPostsResponse>;

          const allPosts = userPostsData.pages.flatMap((page) => page.posts);

          const post = allPosts.find((post) => post.id === id);

          if (post) {
            return { posts: [post] };
          }

          return undefined;
        }
      }
    },
  });

  // Automatically refetches post data if it's a reply and we have only one post
  // This ensures we always have fresh data for reply posts
  useEffect(() => {
    if (!enabled) return;

    if (data.posts.length === 1 && !!data.posts[0].reply) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, data]);

  return {
    data,
    isLoading,
    isFetching,
    isRefetching,
    isError,
  };
};
