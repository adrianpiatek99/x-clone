import { useAuth } from '@/components/context/AuthContext';
import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { apiRequest } from '@/db/utils/api';
import type { GetProfileDetailsParams, GetProfileDetailsResponse } from '@/types/user';
import { useQuery } from '@tanstack/react-query';

type Props = GetProfileDetailsParams & {
  enabled?: boolean;
};

export const useGetUserByScreenNameQuery = ({ screenName, enabled = true }: Props) => {
  const { user } = useAuth();

  const { data, isLoading, isRefetching, isError } = useQuery<GetProfileDetailsResponse>({
    queryKey: QUERY_KEYS.PROFILE.USER_BY_SCREEN_NAME(screenName),
    queryFn: () => apiRequest('GET', API_ENDPOINTS.PROFILE.DETAILS({ screenName })),
    enabled,
    initialData: () => {
      if (user?.screenName === screenName) {
        return {
          id: user.id,
          screenName,
          name: user.name,
          avatarUrl: user.avatarUrl,
          bannerUrl: user.bannerUrl,
          description: user.description,
          isVerified: user.isVerified,
          url: user.url,
          role: user.role,
          isFollowing: false,
          followersCount: user.followersCount,
          followingCount: user.followingCount,
          verifiedAt: user.verifiedAt,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      }

      return undefined;
    },
    refetchOnWindowFocus: user?.screenName !== screenName,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: user?.screenName === screenName ? 0 : 300 * 1000, // 0 if it's the current user, 5 minutes otherwise
  });
  const isEmpty = !data && !isLoading;
  const isMe = user?.screenName === data?.screenName;

  return { data, isLoading, isRefetching, isError, isEmpty, isMe };
};
