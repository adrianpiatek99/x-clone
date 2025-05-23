import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useToasts } from '@/hooks/useToasts';
import type {
  CreatePostReplyRequest,
  CreatePostReplyResponse,
  GetGlobalTimelineResponse,
  GetPostDetailsResponse,
  GetUserLikesResponse,
  GetUserPostsResponse,
} from '@/types/post';
import { apiRequest } from '@/utils/api';
import { createFormData } from '@/utils/formData';
import {
  compareQueryKeys,
  updateItemInCache,
  updateItemInInfiniteQueryCache,
} from '@/utils/queryCache';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

export type Props = {
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
};

export const useCreatePostReplyMutation = ({ onSuccess, onError, onSettled }: Props = {}) => {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const { addToast } = useToasts();

  const { mutate, isPending } = useMutation<
    CreatePostReplyResponse,
    ApiAxiosError,
    CreatePostReplyRequest
  >({
    mutationFn: (data) => {
      const formData = createFormData(data);

      return apiRequest('POST', API_ENDPOINTS.POSTS.CREATE_POST_REPLY, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: ({ postReply: { postId } }) => {
      addToast('success', t('post.api.replyPost.success'));

      // Update the cache
      updateItemInInfiniteQueryCache<
        GetGlobalTimelineResponse | GetUserPostsResponse | GetUserLikesResponse
      >(
        queryClient,
        (queryKey) =>
          compareQueryKeys(queryKey, QUERY_KEYS.POSTS.GLOBAL_TIMELINE.BASE) ||
          compareQueryKeys(queryKey, QUERY_KEYS.POSTS.USER_POSTS.BASE) ||
          compareQueryKeys(queryKey, QUERY_KEYS.POSTS.USER_MEDIA.BASE) ||
          compareQueryKeys(queryKey, QUERY_KEYS.POSTS.USER_LIKES.BASE),
        postId,
        (post) => {
          post.repliesCount++;
        },
        { itemsKey: 'posts' }
      );

      updateItemInCache<GetPostDetailsResponse>(
        queryClient,
        QUERY_KEYS.POSTS.DETAILS(postId),
        (post) => {
          post.repliesCount++;
        }
      );

      onSuccess?.();
    },
    onError: () => {
      addToast('error', t('post.api.replyPost.error'), { duration: 6000 });

      onError?.();
    },
    onSettled: () => {
      onSettled?.();
    },
  });

  const createPostReply = (data: CreatePostReplyRequest) => {
    if (isPending) return;

    mutate(data);
  };

  return { createPostReply, isPending };
};
