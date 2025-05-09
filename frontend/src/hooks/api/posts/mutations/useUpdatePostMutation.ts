import type { GetUserLikesResponse } from '@/app/api/[screenName]/userLikes/route';
import type { GetUserPostsResponse } from '@/app/api/[screenName]/userPosts/route';
import type {
  UpdatePostParams,
  UpdatePostRequest,
  UpdatePostResponse,
} from '@/app/api/posts/[id]/update/route';
import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { apiRequest } from '@/db/utils/api';
import { useToasts } from '@/hooks/useToasts';
import type { GetGlobalTimelineResponse, GetPostDetailsResponse } from '@/types/post';
import { createFormData } from '@/utils/formData';
import { updateItemInCache, updateItemInInfiniteQueryCache } from '@/utils/queryCache';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

type Props = {
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
};

export const useUpdatePostMutation = ({ onSuccess, onError, onSettled }: Props = {}) => {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const { addToast } = useToasts();

  const { mutate, isPending } = useMutation<
    UpdatePostResponse,
    ApiAxiosError,
    UpdatePostRequest & UpdatePostParams
  >({
    mutationFn: ({ id, ...data }) => {
      const formData = createFormData(data);

      return apiRequest('PATCH', API_ENDPOINTS.POSTS.UPDATE({ id }), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: (updatedPost) => {
      addToast('success', t('post.api.updatePost.success'));

      // Update the cache with the updated post
      updateItemInInfiniteQueryCache<GetGlobalTimelineResponse>(
        queryClient,
        QUERY_KEYS.POSTS.GLOBAL_TIMELINE,
        updatedPost.id,
        (post) => Object.assign(post, updatedPost),
        { itemsKey: 'posts' }
      );

      updateItemInInfiniteQueryCache<GetUserPostsResponse>(
        queryClient,
        QUERY_KEYS.POSTS.USER_POSTS(updatedPost.author.screenName),
        updatedPost.id,
        (post) => Object.assign(post, updatedPost),
        { itemsKey: 'posts' }
      );

      updateItemInInfiniteQueryCache<GetUserLikesResponse>(
        queryClient,
        QUERY_KEYS.POSTS.USER_LIKES(updatedPost.author.screenName),
        updatedPost.id,
        (like) => Object.assign(like.post, updatedPost),
        { itemsKey: 'likes', findByKey: 'postId' }
      );

      updateItemInCache<GetPostDetailsResponse>(
        queryClient,
        QUERY_KEYS.POSTS.DETAILS(updatedPost.id),
        (post) => Object.assign(post, updatedPost)
      );

      onSuccess?.();
    },
    onError: () => {
      addToast('error', t('post.api.updatePost.error'), { duration: 6000 });

      onError?.();
    },
    onSettled: () => {
      onSettled?.();
    },
  });

  const updatePost = (data: UpdatePostRequest & UpdatePostParams) => {
    if (isPending) return;

    mutate(data);
  };

  return { updatePost, isPending };
};
