import { useMemo } from 'react';

import { useAuth } from '@/components/context/AuthContext';
import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { GetProfileDetailsParams, GetProfileDetailsResponse } from '@/types/user';
import { apiRequest } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';

type Props = GetProfileDetailsParams & {
  enabled?: boolean;
};

export const useGetUserByScreenNameQuery = ({ screenName, enabled = true }: Props) => {
  const { user } = useAuth();
  const isMe = user?.screenName === screenName;

  const { data, isLoading, isRefetching, isError } = useQuery<GetProfileDetailsResponse>({
    queryKey: QUERY_KEYS.PROFILE.USER_BY_SCREEN_NAME(screenName),
    queryFn: () => apiRequest('GET', API_ENDPOINTS.PROFILE.DETAILS({ screenName })),
    enabled: enabled && !isMe,
    // initialData: () => {
    //   if (user?.screenName === screenName) {
    //     return user;
    //   }
    // },
    refetchOnMount: false,
    refetchOnWindowFocus: !isMe,
    // staleTime: 30 * 1000, // 30 seconds
    // gcTime: user?.screenName === screenName ? 0 : 300 * 1000, // 0 if it's the current user, 5 minutes otherwise
  });

  const userData = useMemo(() => {
    if (user?.screenName === screenName) {
      return user;
    }

    return data;
  }, [data, user, screenName]);

  const isEmpty = !userData && !isLoading;

  return { data: userData, isLoading, isRefetching, isError, isEmpty, isMe };
};
