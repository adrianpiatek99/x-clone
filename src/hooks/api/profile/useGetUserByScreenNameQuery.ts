import type {
  GetUserByScreenNameParams,
  GetUserByScreenNameResponse,
} from '@/app/api/profile/[screenName]/route';
import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { apiRequest } from '@/db/utils/api';
import { useAppSession } from '@/hooks/useAppSession';
import { useQuery } from '@tanstack/react-query';

type Props = GetUserByScreenNameParams;

export const useGetUserByScreenNameQuery = ({ screenName }: Props) => {
  const { user } = useAppSession();

  const { data, isLoading, isRefetching, isError } = useQuery<GetUserByScreenNameResponse>({
    queryKey: QUERY_KEYS.PROFILE.USER_BY_SCREEN_NAME(screenName),
    queryFn: () => apiRequest('GET', API_ENDPOINTS.PROFILE.USER_BY_SCREEN_NAME({ screenName })),
    enabled: user?.screenName !== screenName,
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
          postsCount: user.postsCount,
          verifiedAt: user.verifiedAt,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      }
    },
    staleTime: 30 * 1000, // 30 seconds
  });

  return { data, isLoading, isRefetching, isError };
};
