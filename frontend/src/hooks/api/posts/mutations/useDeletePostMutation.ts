import type { PostPageParams } from '@/app/[locale]/[screenName]/post/[id]/(post)/layout';
import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useToasts } from '@/hooks/useToasts';
import type {
  DeletePostParams,
  DeletePostResponse,
  GetGlobalTimelineResponse,
  GetUserLikesResponse,
  GetUserPostsResponse,
} from '@/types/post';
import { apiRequest } from '@/utils/api';
import {
  compareQueryKeys,
  deleteItemFromInfiniteQueryCache,
  updateTotalCountInInfiniteQueryCache,
} from '@/utils/queryCache';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

type Props = {
  screenName: string;
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
};

type Context = {
  previousTimeline: GetGlobalTimelineResponse | undefined;
  previousUserPosts: GetUserPostsResponse | undefined;
  previousUserLikes: GetUserLikesResponse | undefined;
  previousPost: unknown;
};

export const useDeletePostMutation = ({ screenName, onSuccess, onError, onSettled }: Props) => {
  const t = useTranslations();
  const params = useParams<PostPageParams>();
  const { addToast } = useToasts();
  const queryClient = useQueryClient();

  const { mutate, isPending: isDeleting } = useMutation<
    DeletePostResponse,
    ApiAxiosError,
    DeletePostParams,
    Context
  >({
    mutationFn: ({ id }) => apiRequest('DELETE', API_ENDPOINTS.POSTS.DELETE({ id })),
    onMutate: async ({ id }) => {
      // Cancel any outgoing queries
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.POSTS.GLOBAL_TIMELINE.BASE });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.POSTS.USER_POSTS.BASE });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.POSTS.USER_LIKES.BASE });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.POSTS.DETAILS.WITH_PARAMS(id) });

      // Snapshot the previous value
      const previousTimeline = queryClient.getQueryData<GetGlobalTimelineResponse>(
        QUERY_KEYS.POSTS.GLOBAL_TIMELINE.BASE
      );
      const previousUserPosts = queryClient.getQueryData<GetUserPostsResponse>(
        QUERY_KEYS.POSTS.USER_POSTS.WITH_PARAMS(screenName)
      );
      const previousUserLikes = queryClient.getQueryData<GetUserLikesResponse>(
        QUERY_KEYS.POSTS.USER_LIKES.WITH_PARAMS(screenName)
      );
      const previousPost = queryClient.getQueryData(QUERY_KEYS.POSTS.DETAILS.WITH_PARAMS(id));

      // Optimistically remove the post from all relevant infinite query caches
      deleteItemFromInfiniteQueryCache<
        GetGlobalTimelineResponse | GetUserPostsResponse | GetUserLikesResponse
      >(
        queryClient,
        (queryKey) =>
          compareQueryKeys(queryKey, QUERY_KEYS.POSTS.GLOBAL_TIMELINE.BASE) ||
          compareQueryKeys(queryKey, QUERY_KEYS.POSTS.USER_POSTS.BASE) ||
          compareQueryKeys(queryKey, QUERY_KEYS.POSTS.USER_LIKES.BASE),
        id,
        {
          itemsKey: 'posts',
        }
      );

      // Remove the post details from the cache to reflect deletion immediately
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.POSTS.DETAILS.WITH_PARAMS(id),
      });

      if (params.id) {
        queryClient.removeQueries({
          queryKey: QUERY_KEYS.POSTS.DETAILS.WITH_PARAMS(params.id),
        });
      }

      // Return snapshot of previous data for potential rollback on error
      return { previousTimeline, previousUserPosts, previousUserLikes, previousPost };
    },
    onSuccess: () => {
      // Decrease the total count of user's posts in cache to reflect the deletion
      updateTotalCountInInfiniteQueryCache<GetUserPostsResponse>(
        queryClient,
        QUERY_KEYS.POSTS.USER_POSTS.WITH_PARAMS(screenName),
        (count) => count - 1
      );

      addToast('success', t('post.api.deletePost.success'));
      onSuccess?.();
    },
    onError: (_err, { id }, context) => {
      // Rollback to the previous data on error
      if (context?.previousTimeline) {
        queryClient.setQueryData(QUERY_KEYS.POSTS.GLOBAL_TIMELINE.BASE, context.previousTimeline);
      }

      if (context?.previousUserPosts) {
        queryClient.setQueryData(
          QUERY_KEYS.POSTS.USER_POSTS.WITH_PARAMS(screenName),
          context.previousUserPosts
        );
      }

      if (context?.previousUserLikes) {
        queryClient.setQueryData(
          QUERY_KEYS.POSTS.USER_LIKES.WITH_PARAMS(screenName),
          context.previousUserLikes
        );
      }

      if (context?.previousPost) {
        queryClient.setQueryData(QUERY_KEYS.POSTS.DETAILS.WITH_PARAMS(id), context.previousPost);
      }

      addToast('error', t('post.api.deletePost.error'), { duration: 6000 });
      onError?.();
    },
    onSettled: () => {
      onSettled?.();
    },
  });

  const deletePost = (data: DeletePostParams) => {
    if (isDeleting) return;

    mutate(data);
  };

  return { deletePost, isDeleting };
};
