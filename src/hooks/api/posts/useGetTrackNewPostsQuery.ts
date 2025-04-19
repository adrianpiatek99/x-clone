import type {
  GetPostsTrackingParams,
  GetPostsTrackingResponse,
} from '@/app/api/posts/trackNewPosts/route';
import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { apiRequest } from '@/db/utils/api';
import { useQuery } from '@tanstack/react-query';

type Props = GetPostsTrackingParams & {
  enabled?: boolean;
};

export const useGetTrackNewPostsQuery = ({ latestPostId, enabled = false }: Props) => {
  const { data, isLoading, isError } = useQuery<GetPostsTrackingResponse>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: QUERY_KEYS.POSTS.TRACK_NEW_POSTS,
    queryFn: () => apiRequest('GET', API_ENDPOINTS.POSTS.TRACK_NEW_POSTS({ latestPostId })),
    enabled: !!latestPostId && enabled,
    initialData: {
      newPostsCount: 0,
    },
  });

  return { data, isLoading, isError };
};
