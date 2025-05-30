import { useAuth } from '@/components/context/AuthContext';
import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useToasts } from '@/hooks/useToasts';
import { useGlobalStore } from '@/stores/global';
import type {
  FollowUserParams,
  FollowUserResponse,
  GetFollowersResponse,
  GetFollowingResponse,
  GetProfileDetailsResponse,
  UnfollowUserParams,
  UnfollowUserResponse,
} from '@/types/user';
import { apiRequest } from '@/utils/api';
import {
  compareQueryKeys,
  updateItemInCache,
  updateItemInInfiniteQueryCache,
} from '@/utils/queryCache';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

type Props = {
  screenName: string;
  userId: string;
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
};

export const useToggleFollowUserMutation = ({
  screenName,
  userId,
  onSuccess,
  onError,
  onSettled,
}: Props) => {
  const t = useTranslations();
  const { user, setUser } = useAuth();
  const queryClient = useQueryClient();
  const { addToast } = useToasts();
  const updateAuthRequiredModal = useGlobalStore((state) => state.updateAuthRequiredModal);

  const { mutate: followUser, isPending: isFollowPending } = useMutation<
    FollowUserResponse,
    ApiAxiosError,
    FollowUserParams
  >({
    mutationFn: ({ userId }) => apiRequest('POST', API_ENDPOINTS.USERS.FOLLOW({ userId })),
    onSuccess: () => {
      // Update user profile in all relevant infinite query caches
      updateItemInInfiniteQueryCache<GetFollowersResponse | GetFollowingResponse>(
        queryClient,
        (queryKey) =>
          compareQueryKeys(queryKey, QUERY_KEYS.PROFILE.FOLLOWERS.BASE) ||
          compareQueryKeys(queryKey, QUERY_KEYS.PROFILE.FOLLOWING.BASE),
        userId,
        (item) => {
          item.isFollowing = true;
          item.followersCount++;
        },
        {
          itemsKey: 'users',
        }
      );

      // Update user profile in cache
      updateItemInCache<GetProfileDetailsResponse>(
        queryClient,
        QUERY_KEYS.PROFILE.USER_BY_SCREEN_NAME(screenName),
        (user) => {
          user.isFollowing = true;
          user.followersCount++;
        }
      );

      // Update user session
      if (user) {
        setUser({ ...user, followingCount: user.followingCount + 1 });
      }

      addToast('success', t('user.api.follow.success'));

      onSuccess?.();
    },
    onError: () => {
      addToast('error', t('user.api.follow.error'));

      onError?.();
    },
    onSettled: () => {
      onSettled?.();
    },
  });

  const { mutate: unfollowUser, isPending: isUnfollowPending } = useMutation<
    UnfollowUserResponse,
    ApiAxiosError,
    UnfollowUserParams
  >({
    mutationFn: ({ userId }) => apiRequest('DELETE', API_ENDPOINTS.USERS.UNFOLLOW({ userId })),
    onSuccess: () => {
      // Update user profile in all relevant infinite query caches
      updateItemInInfiniteQueryCache<GetFollowersResponse | GetFollowingResponse>(
        queryClient,
        (queryKey) =>
          compareQueryKeys(queryKey, QUERY_KEYS.PROFILE.FOLLOWERS.BASE) ||
          compareQueryKeys(queryKey, QUERY_KEYS.PROFILE.FOLLOWING.BASE),
        userId,
        (item) => {
          item.isFollowing = false;
          item.followersCount--;
        },
        {
          itemsKey: 'users',
        }
      );

      // Update user profile in cache
      updateItemInCache<GetProfileDetailsResponse>(
        queryClient,
        QUERY_KEYS.PROFILE.USER_BY_SCREEN_NAME(screenName),
        (user) => {
          user.isFollowing = false;
          user.followersCount--;
        }
      );

      // Update user session
      if (user) {
        setUser({ ...user, followingCount: user.followingCount - 1 });
      }

      addToast('success', t('user.api.unfollow.success'));

      onSuccess?.();
    },
    onError: () => {
      addToast('error', t('user.api.unfollow.error'));

      onError?.();
    },
    onSettled: () => {
      onSettled?.();
    },
  });

  const isToggleFollowPending = isFollowPending || isUnfollowPending;

  const toggleFollowUser = (isFollowing: boolean) => {
    if (isToggleFollowPending) return;

    if (!user) {
      updateAuthRequiredModal({ isOpen: true });

      return;
    }

    if (isFollowing) {
      unfollowUser({ userId });

      return;
    }

    followUser({ userId });
  };

  return { toggleFollowUser, isToggleFollowPending };
};
