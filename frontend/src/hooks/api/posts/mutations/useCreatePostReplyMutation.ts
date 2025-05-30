import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useToasts } from '@/hooks/useToasts';
import type {
  CreatePostReplyRequest,
  CreatePostReplyResponse,
  GetGlobalTimelineResponse,
  GetPostDetailsResponse,
  GetPostRepliesResponse,
  GetUserLikesResponse,
  GetUserPostsResponse,
} from '@/types/post';
import { apiRequest } from '@/utils/api';
import { createFormData } from '@/utils/formData';
import {
  addItemToInfiniteQueryCache,
  compareQueryKeys,
  updateItemInInfiniteQueryCache,
  updateItemInSimpleArrayCache,
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
    onSuccess: ({ postReply }) => {
      addToast('success', t('post.api.replyPost.success'));
      onSuccess?.();

      const { replyToPostId } = postReply;

      if (!replyToPostId) return;

      // Update the relevant infinite query caches with the new post reply
      addItemToInfiniteQueryCache<GetPostRepliesResponse>(
        queryClient,
        (queryKey) =>
          compareQueryKeys(queryKey, QUERY_KEYS.POSTS.POST_REPLIES.WITH_PARAMS(replyToPostId)),
        postReply,
        { itemsKey: 'postReplies' }
      );

      // Increment the repliesCount in all relevant infinite query caches
      updateItemInInfiniteQueryCache<
        GetGlobalTimelineResponse | GetUserPostsResponse | GetUserLikesResponse
      >(
        queryClient,
        (queryKey) =>
          compareQueryKeys(queryKey, QUERY_KEYS.POSTS.GLOBAL_TIMELINE.BASE) ||
          compareQueryKeys(queryKey, QUERY_KEYS.POSTS.USER_POSTS.BASE) ||
          compareQueryKeys(queryKey, QUERY_KEYS.POSTS.USER_MEDIA.BASE) ||
          compareQueryKeys(queryKey, QUERY_KEYS.POSTS.USER_LIKES.BASE),
        replyToPostId,
        (post) => {
          post.repliesCount++;
        },
        { itemsKey: 'posts' }
      );

      // Increment repliesCount in post details cache
      updateItemInInfiniteQueryCache<GetPostRepliesResponse>(
        queryClient,
        (queryKey) => compareQueryKeys(queryKey, QUERY_KEYS.POSTS.POST_REPLIES.BASE),
        replyToPostId,
        (post) => {
          post.repliesCount++;
        },
        {
          itemsKey: 'postReplies',
        }
      );

      // Increment repliesCount in post details cache
      updateItemInSimpleArrayCache<GetPostDetailsResponse>(
        queryClient,
        (queryKey) => compareQueryKeys(queryKey, QUERY_KEYS.POSTS.DETAILS.BASE),
        replyToPostId,
        (post) => {
          post.repliesCount++;
        },
        {
          itemsKey: 'posts',
        }
      );
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
