import type { GetUserLikesResponse } from '@/app/api/[screenName]/userLikes/route';
import type { GetUserPostsResponse } from '@/app/api/[screenName]/userPosts/route';
import type { LikePostParams, LikePostResponse } from '@/app/api/posts/[id]/like/route';
import type { GetPostResponse } from '@/app/api/posts/[id]/route';
import type { UnlikePostParams, UnlikePostResponse } from '@/app/api/posts/[id]/unlike/route';
import type { GetGlobalTimelineResponse } from '@/app/api/posts/globalTimeline/route';
import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { apiRequest } from '@/db/utils/api';
import { useAppSession } from '@/hooks/useAppSession';
import { useToasts } from '@/hooks/useToasts';
import { useGlobalStore } from '@/stores/global';
import { updateItemInCache, updateItemInInfiniteQueryCache } from '@/utils/queryCache';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

type Props = {
  screenName: string;
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
};

export const useToggleLikePostMutation = ({ screenName, onSuccess, onError, onSettled }: Props) => {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const { addToast } = useToasts();
  const { user } = useAppSession();
  const updateAuthRequiredModal = useGlobalStore((state) => state.updateAuthRequiredModal);

  const { mutate: likeMutate, isPending: isLikePending } = useMutation<
    LikePostResponse,
    ApiAxiosError,
    LikePostParams
  >({
    mutationFn: ({ id }) => apiRequest('POST', API_ENDPOINTS.POSTS.LIKE({ id })),
    onSuccess: ({ id }) => {
      addToast('success', t('post.api.likePost.success'));

      // Update the cache with the updated post
      updateItemInInfiniteQueryCache<GetGlobalTimelineResponse>(
        queryClient,
        QUERY_KEYS.POSTS.GLOBAL_TIMELINE,
        id,
        (post) => {
          post.isLiked = true;
          post.likesCount++;
        },
        { itemsKey: 'posts' }
      );

      updateItemInInfiniteQueryCache<GetUserPostsResponse>(
        queryClient,
        QUERY_KEYS.POSTS.USER_POSTS(screenName),
        id,
        (post) => {
          post.isLiked = true;
          post.likesCount++;
        },
        { itemsKey: 'posts' }
      );

      updateItemInInfiniteQueryCache<GetUserLikesResponse>(
        queryClient,
        QUERY_KEYS.POSTS.USER_LIKES(screenName),
        id,
        (like) => {
          like.post.isLiked = true;
          like.post.likesCount++;
        },
        { itemsKey: 'likes', findByKey: 'postId' }
      );

      // Update the total count of likes
      // updateTotalCountInInfiniteQueryCache<GetUserLikesResponse>(
      //   queryClient,
      //   QUERY_KEYS.POSTS.USER_LIKES(screenName),
      //   (count) => count + 1
      // );

      updateItemInCache<GetPostResponse>(queryClient, QUERY_KEYS.POSTS.DETAILS(id), (post) => {
        post.isLiked = true;
        post.likesCount++;
      });

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
    mutationFn: ({ id }) => apiRequest('DELETE', API_ENDPOINTS.POSTS.UNLIKE({ id })),
    onSuccess: ({ id }) => {
      addToast('success', t('post.api.unlikePost.success'));

      // Update the cache with the updated post
      updateItemInInfiniteQueryCache<GetGlobalTimelineResponse>(
        queryClient,
        QUERY_KEYS.POSTS.GLOBAL_TIMELINE,
        id,
        (post) => {
          post.isLiked = false;
          post.likesCount--;
        },
        { itemsKey: 'posts' }
      );

      updateItemInInfiniteQueryCache<GetUserPostsResponse>(
        queryClient,
        QUERY_KEYS.POSTS.USER_POSTS(screenName),
        id,
        (post) => {
          post.isLiked = false;
          post.likesCount--;
        },
        { itemsKey: 'posts' }
      );

      updateItemInInfiniteQueryCache<GetUserLikesResponse>(
        queryClient,
        QUERY_KEYS.POSTS.USER_LIKES(screenName),
        id,
        (like) => {
          like.post.isLiked = false;
          like.post.likesCount--;
        },
        { itemsKey: 'likes', findByKey: 'postId' }
      );

      // Update the total count of likes
      // updateTotalCountInInfiniteQueryCache<GetUserLikesResponse>(
      //   queryClient,
      //   QUERY_KEYS.POSTS.USER_LIKES(screenName),
      //   (count) => count - 1
      // );

      updateItemInCache<GetPostResponse>(queryClient, QUERY_KEYS.POSTS.DETAILS(id), (post) => {
        post.isLiked = false;
        post.likesCount--;
      });

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
