import type { LikePostRequest, LikePostResponse } from '@/app/api/posts/[id]/like/route';
import type { UnlikePostRequest, UnlikePostResponse } from '@/app/api/posts/[id]/unlike/route';
import type { GlobalPostsTimelineResponse } from '@/app/api/posts/globalTimeline/route';
import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { apiRequest } from '@/db/utils/api';
import { useAppSession } from '@/hooks/useAppSession';
import { useToasts } from '@/hooks/useToasts';
import { useGlobalStore } from '@/stores/global';
import { type InfiniteQueryData, updateInfiniteQueryWithUpdatedItem } from '@/utils/queryCache';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

type Props = {
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
};

export const useToggleLikePostMutation = ({ onSuccess, onError, onSettled }: Props = {}) => {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const { addToast } = useToasts();
  const { user } = useAppSession();
  const updateAuthRequiredModal = useGlobalStore((state) => state.updateAuthRequiredModal);

  const { mutate: likeMutate, isPending: isLikePending } = useMutation<
    LikePostResponse,
    ApiAxiosError,
    LikePostRequest
  >({
    mutationFn: ({ id }) => apiRequest('GET', API_ENDPOINTS.POSTS.LIKE(id)),
    onSuccess: ({ id }) => {
      addToast('success', t('post.api.likePost.success'));

      // Update the cache with the liked post
      queryClient.setQueryData<InfiniteQueryData<GlobalPostsTimelineResponse>>(
        QUERY_KEYS.POSTS.GLOBAL_TIMELINE,
        (oldData) =>
          updateInfiniteQueryWithUpdatedItem(
            oldData,
            id,
            (post) => {
              post.isLiked = true;
              post.likesCount++;
            },
            { itemsKey: 'posts' }
          )
      );

      onSuccess?.();
    },
    onError: () => {
      addToast('error', t('post.api.likePost.error'), { duration: 6000 });

      onError?.();
    },
    onSettled: () => {
      onSettled?.();
    },
  });

  const { mutate: unlikeMutate, isPending: isUnlikePending } = useMutation<
    UnlikePostResponse,
    ApiAxiosError,
    UnlikePostRequest
  >({
    mutationFn: ({ id }) => apiRequest('GET', API_ENDPOINTS.POSTS.UNLIKE(id)),
    onSuccess: ({ id }) => {
      addToast('success', t('post.api.unlikePost.success'));

      // Update the cache with the unliked post
      queryClient.setQueryData<InfiniteQueryData<GlobalPostsTimelineResponse>>(
        QUERY_KEYS.POSTS.GLOBAL_TIMELINE,
        (oldData) =>
          updateInfiniteQueryWithUpdatedItem(
            oldData,
            id,
            (post) => {
              post.isLiked = false;
              post.likesCount--;
            },
            { itemsKey: 'posts' }
          )
      );

      onSuccess?.();
    },
    onError: () => {
      addToast('error', t('post.api.unlikePost.error'), { duration: 6000 });

      onError?.();
    },
    onSettled: () => {
      onSettled?.();
    },
  });

  const isToggleLikePending = isLikePending || isUnlikePending;

  const toggleLikePost = (id: string, isLiked: boolean) => {
    if (isToggleLikePending) return;

    if (!user) {
      updateAuthRequiredModal({ isOpen: true });

      return;
    }

    if (isLiked) {
      unlikeMutate({ id });

      return;
    }

    likeMutate({ id });
  };

  return { toggleLikePost, isToggleLikePending };
};
