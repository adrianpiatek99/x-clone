import { useAuth } from '@/components/context/AuthContext';
import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useToasts } from '@/hooks/useToasts';
import { useGlobalStore } from '@/stores/global';
import type {
  GetGlobalTimelineResponse,
  GetPostDetailsResponse,
  GetUserLikesResponse,
  GetUserPostsResponse,
  LikePostParams,
  LikePostResponse,
  UnlikePostParams,
  UnlikePostResponse,
} from '@/types/post';
import { apiRequest } from '@/utils/api';
import type { InfiniteQueryData } from '@/utils/queryCache';
import {
  compareQueryKeys,
  updateInfiniteQueryWithUpdatedItem,
  updateItemInCache,
} from '@/utils/queryCache';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

type Props = {
  screenName: string;
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
};

export const useToggleLikePostMutation = ({ onSuccess, onError, onSettled }: Props) => {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const { addToast } = useToasts();
  const { user } = useAuth();
  const updateAuthRequiredModal = useGlobalStore((state) => state.updateAuthRequiredModal);

  const { mutate: likeMutate, isPending: isLikePending } = useMutation<
    LikePostResponse,
    ApiAxiosError,
    LikePostParams
  >({
    mutationFn: ({ postId }) => apiRequest('POST', API_ENDPOINTS.POSTS.LIKE({ postId })),
    onSuccess: ({ id }) => {
      addToast('success', t('post.api.likePost.success'));

      // Update the cache with the updated post
      queryClient.setQueriesData<
        InfiniteQueryData<GetGlobalTimelineResponse | GetUserPostsResponse | GetUserLikesResponse>
      >(
        {
          predicate: (query) => {
            const queryKey = query.queryKey;

            return (
              compareQueryKeys(queryKey, QUERY_KEYS.POSTS.GLOBAL_TIMELINE) ||
              compareQueryKeys(queryKey, QUERY_KEYS.POSTS.USER_POSTS.BASE) ||
              compareQueryKeys(queryKey, QUERY_KEYS.POSTS.USER_LIKES.BASE)
            );
          },
        },
        (oldData) =>
          updateInfiniteQueryWithUpdatedItem(
            oldData,
            id,
            (post) => {
              post.isLiked = true;
              post.likesCount++;
            },
            {
              itemsKey: 'posts',
            }
          )
      );

      // Update the total count of likes
      // updateTotalCountInInfiniteQueryCache<GetUserLikesResponse>(
      //   queryClient,
      //   QUERY_KEYS.POSTS.USER_LIKES(screenName),
      //   (count) => count + 1
      // );

      updateItemInCache<GetPostDetailsResponse>(
        queryClient,
        QUERY_KEYS.POSTS.DETAILS(id),
        (post) => {
          post.isLiked = true;
          post.likesCount++;
        }
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
    UnlikePostParams
  >({
    mutationFn: ({ postId }) => apiRequest('DELETE', API_ENDPOINTS.POSTS.UNLIKE({ postId })),
    onSuccess: ({ id }) => {
      addToast('success', t('post.api.unlikePost.success'));

      // Update the cache with the updated post
      queryClient.setQueriesData<
        InfiniteQueryData<GetGlobalTimelineResponse | GetUserPostsResponse | GetUserLikesResponse>
      >(
        {
          predicate: (query) => {
            const queryKey = query.queryKey;

            return (
              compareQueryKeys(queryKey, QUERY_KEYS.POSTS.GLOBAL_TIMELINE) ||
              compareQueryKeys(queryKey, QUERY_KEYS.POSTS.USER_POSTS.BASE) ||
              compareQueryKeys(queryKey, QUERY_KEYS.POSTS.USER_LIKES.BASE)
            );
          },
        },
        (oldData) =>
          updateInfiniteQueryWithUpdatedItem(
            oldData,
            id,
            (post) => {
              post.isLiked = false;
              post.likesCount--;
            },
            {
              itemsKey: 'posts',
            }
          )
      );

      // Update the total count of likes
      // updateTotalCountInInfiniteQueryCache<GetUserLikesResponse>(
      //   queryClient,
      //   QUERY_KEYS.POSTS.USER_LIKES(screenName),
      //   (count) => count - 1
      // );

      updateItemInCache<GetPostDetailsResponse>(
        queryClient,
        QUERY_KEYS.POSTS.DETAILS(id),
        (post) => {
          post.isLiked = false;
          post.likesCount--;
        }
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
      unlikeMutate({ postId: id });

      return;
    }

    likeMutate({ postId: id });
  };

  return { toggleLikePost, isToggleLikePending };
};
