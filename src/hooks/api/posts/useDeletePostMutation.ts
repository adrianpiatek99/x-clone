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
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
};

export const useDeletePostMutation = ({ onSuccess, onError, onSettled }: Props = {}) => {
  const t = useTranslations();
  const { addToast } = useToasts();
  const queryClient = useQueryClient();

  const { mutate, isPending: isDeleting } = useMutation<
    DeletePostResponse,
    ApiAxiosError,
    DeletePostParams
  >({
    mutationFn: ({ id }) => apiRequest('DELETE', API_ENDPOINTS.POSTS.DELETE({ id })),
    onSuccess: ({ id }) => {
      addToast('success', t('post.api.deletePost.success'));

      // Update the cache with the deleted post
      deleteItemFromInfiniteQueryCache<GetGlobalTimelineResponse>(
        queryClient,
        QUERY_KEYS.POSTS.GLOBAL_TIMELINE,
        id,
        { itemsKey: 'posts' }
      );

      deleteItemFromCache(queryClient, QUERY_KEYS.POSTS.DETAILS(id), id);

      onSuccess?.();
    },
    onError: () => {
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
