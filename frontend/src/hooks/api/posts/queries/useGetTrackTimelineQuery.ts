import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { GetTrackTimelineParams, GetTrackTimelineResponse } from '@/types/post';
import { apiRequest } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';

type Props = GetTrackTimelineParams & {
  enabled?: boolean;
};

export const useGetTrackTimelineQuery = ({ latestPostId, enabled = false }: Props) => {
  const { data, isLoading, isError } = useQuery<GetTrackTimelineResponse>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: QUERY_KEYS.POSTS.TRACK_TIMELINE,
    queryFn: () => apiRequest('GET', API_ENDPOINTS.POSTS.TRACK_TIMELINE({ latestPostId })),
    enabled: !!latestPostId && enabled,
    initialData: {
      newPostsCount: 0,
    },
  });

  return { data, isLoading, isError };
};
