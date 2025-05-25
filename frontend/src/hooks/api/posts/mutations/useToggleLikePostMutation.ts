import { useAuth } from '@/components/context/AuthContext';
import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useToasts } from '@/hooks/useToasts';
import { useGlobalStore } from '@/stores/global';
import type {
  GetGlobalTimelineResponse,
  GetPostDetailsResponse,
  GetPostRepliesResponse,
  GetUserLikesResponse,
  GetUserPostsResponse,
  LikePostParams,
  LikePostResponse,
  UnlikePostParams,
  UnlikePostResponse,
} from '@/types/post';
import { apiRequest } from '@/utils/api';
import {
  compareQueryKeys,
  updateItemInInfiniteQueryCache,
  updateItemInSimpleArrayCache,
  updateTotalCountInInfiniteQueryCache,
} from '@/utils/queryCache';
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
  const { user } = useAuth();
  const updateAuthRequiredModal = useGlobalStore((state) => state.updateAuthRequiredModal);

  const { mutate: likeMutate, isPending: isLikePending } = useMutation<
    LikePostResponse,
    ApiAxiosError,
    LikePostParams
  >({
    mutationFn: ({ postId }) => apiRequest('POST', API_ENDPOINTS.POSTS.LIKE({ postId })),
    onSuccess: ({ id }) => {
      // Update the post in all relevant infinite query caches
      updateItemInInfiniteQueryCache<
        GetGlobalTimelineResponse | GetUserPostsResponse | GetUserLikesResponse
      >(
        queryClient,
        (queryKey) =>
          compareQueryKeys(queryKey, QUERY_KEYS.POSTS.GLOBAL_TIMELINE.BASE) ||
          compareQueryKeys(queryKey, QUERY_KEYS.POSTS.USER_POSTS.BASE) ||
          compareQueryKeys(queryKey, QUERY_KEYS.POSTS.USER_LIKES.BASE),
        id,
        (post) => {
          post.isLiked = true;
          post.likesCount++;
        },
        { itemsKey: 'posts' }
      );

      // Update the post in the post details cache
      updateItemInSimpleArrayCache<GetPostDetailsResponse>(
        queryClient,
        (queryKey) => compareQueryKeys(queryKey, QUERY_KEYS.POSTS.DETAILS.BASE),
        id,
        (post) => {
          post.isLiked = true;
          post.likesCount++;
        },
        {
          itemsKey: 'posts',
        }
      );

      // Update the post in replies cache if it's visible in a thread
      updateItemInInfiniteQueryCache<GetPostRepliesResponse>(
        queryClient,
        (queryKey) => compareQueryKeys(queryKey, QUERY_KEYS.POSTS.POST_REPLIES.BASE),
        id,
        (post) => {
          post.isLiked = true;
          post.likesCount++;
        },
        { itemsKey: 'postReplies' }
      );

      // Increment the total number of liked posts in the user likes cache
      if (user) {
        updateTotalCountInInfiniteQueryCache<GetUserLikesResponse>(
          queryClient,
          QUERY_KEYS.POSTS.USER_LIKES.WITH_PARAMS(user.screenName),
          (count) => count + 1
        );
      }

      addToast('success', t('post.api.likePost.success'));
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
      // Update the post in all relevant infinite query caches
      updateItemInInfiniteQueryCache<
        GetGlobalTimelineResponse | GetUserPostsResponse | GetUserLikesResponse
      >(
        queryClient,
        (queryKey) =>
          compareQueryKeys(queryKey, QUERY_KEYS.POSTS.GLOBAL_TIMELINE.BASE) ||
          compareQueryKeys(queryKey, QUERY_KEYS.POSTS.USER_POSTS.BASE) ||
          compareQueryKeys(queryKey, QUERY_KEYS.POSTS.USER_LIKES.BASE),
        id,
        (post) => {
          post.isLiked = false;
          post.likesCount--;
        },
        { itemsKey: 'posts' }
      );

      // Update the post in the post details cache
      updateItemInSimpleArrayCache<GetPostDetailsResponse>(
        queryClient,
        (queryKey) => compareQueryKeys(queryKey, QUERY_KEYS.POSTS.DETAILS.BASE),
        id,
        (post) => {
          post.isLiked = false;
          post.likesCount--;
        },
        {
          itemsKey: 'posts',
        }
      );

      // Update the post in replies cache if it's visible in a thread
      updateItemInInfiniteQueryCache<GetPostRepliesResponse>(
        queryClient,
        (queryKey) => compareQueryKeys(queryKey, QUERY_KEYS.POSTS.POST_REPLIES.BASE),
        id,
        (post) => {
          post.isLiked = false;
          post.likesCount--;
        },
        { itemsKey: 'postReplies' }
      );

      // Decrement the total number of liked posts in the user likes cache
      if (user) {
        updateTotalCountInInfiniteQueryCache<GetUserLikesResponse>(
          queryClient,
          QUERY_KEYS.POSTS.USER_LIKES.WITH_PARAMS(user.screenName),
          (count) => count - 1
        );
      }

      addToast('success', t('post.api.unlikePost.success'));
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
