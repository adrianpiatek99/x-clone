import type { GetUserLikesResponse } from '@/app/api/[screenName]/userLikes/route';
import type { GetUserPostsResponse } from '@/app/api/[screenName]/userPosts/route';
import type { DeletePostParams, DeletePostResponse } from '@/app/api/posts/[id]/delete/route';
import type { GetGlobalTimelineResponse } from '@/app/api/posts/globalTimeline/route';
import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { apiRequest } from '@/db/utils/api';
import { useToasts } from '@/hooks/useToasts';
import { deleteItemFromCache, deleteItemFromInfiniteQueryCache } from '@/utils/queryCache';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

type Props = {
  screenName: string;
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
};

type Context = {
  previousTimeline: GetGlobalTimelineResponse | undefined;
  previousPost: unknown;
};

export const useDeletePostMutation = ({ screenName, onSuccess, onError, onSettled }: Props) => {
  const t = useTranslations();
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
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.POSTS.GLOBAL_TIMELINE });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.POSTS.DETAILS(id) });

      // Snapshot the previous value
      const previousTimeline = queryClient.getQueryData<GetGlobalTimelineResponse>(
        QUERY_KEYS.POSTS.GLOBAL_TIMELINE
      );
      const previousUserPosts = queryClient.getQueryData<GetUserPostsResponse>(
        QUERY_KEYS.POSTS.USER_POSTS(screenName)
      );
      const previousUserLikes = queryClient.getQueryData<GetUserLikesResponse>(
        QUERY_KEYS.POSTS.USER_LIKES(screenName)
      );
      const previousPost = queryClient.getQueryData(QUERY_KEYS.POSTS.DETAILS(id));

      // Optimistically update the cache
      deleteItemFromInfiniteQueryCache<GetGlobalTimelineResponse>(
        queryClient,
        QUERY_KEYS.POSTS.GLOBAL_TIMELINE,
        id,
        { itemsKey: 'posts' }
      );

      deleteItemFromInfiniteQueryCache<GetUserPostsResponse>(
        queryClient,
        QUERY_KEYS.POSTS.USER_POSTS(screenName),
        id,
        { itemsKey: 'posts' }
      );

      deleteItemFromInfiniteQueryCache<GetUserLikesResponse>(
        queryClient,
        QUERY_KEYS.POSTS.USER_LIKES(screenName),
        id,
        { itemsKey: 'likes', deleteByKey: 'postId' }
      );

      queryClient.removeQueries({
        queryKey: QUERY_KEYS.POSTS.DETAILS(id),
      });

      return { previousTimeline, previousUserPosts, previousUserLikes, previousPost };
    },
    onSuccess: () => {
      addToast('success', t('post.api.deletePost.success'));
      onSuccess?.();
    },
    onError: (_err, { id }, context) => {
      // Rollback to the previous state on error
      if (context?.previousTimeline) {
        queryClient.setQueryData(QUERY_KEYS.POSTS.GLOBAL_TIMELINE, context.previousTimeline);
      }

      if (context?.previousPost) {
        queryClient.setQueryData(QUERY_KEYS.POSTS.DETAILS(id), context.previousPost);
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
