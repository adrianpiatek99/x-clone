import React, { useState } from 'react';

import Button from '@/components/atoms/Button';
import { useGetUserByScreenNameQuery } from '@/hooks/api/profile/queries';
import { useToggleFollowUserMutation } from '@/hooks/api/users/mutations';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import type { ProfileParams } from '../../layout';

const LazyConfirmModal = dynamic(
  () => import('@/components/atoms/ConfirmModal').then((mod) => mod.ConfirmModal),
  {
    ssr: false,
  }
);

export const ProfileHeroFollowButton = () => {
  const t = useTranslations();
  const { screenName } = useParams<ProfileParams>();
  const { data, isMe } = useGetUserByScreenNameQuery({
    screenName,
    enabled: false,
  });
  const [isUnfollowModalOpen, setIsUnfollowModalOpen] = useState(false);
  const { toggleFollowUser, isToggleFollowPending } = useToggleFollowUserMutation({
    screenName,
  });

  if (!data || isMe) return null;

  const { isFollowing } = data;

  const handleUnfollow = () => {
    setIsUnfollowModalOpen(false);
    toggleFollowUser(data.id, data.isFollowing);
  };

  const handleToggleFollow = () =>
    isFollowing ? setIsUnfollowModalOpen(true) : toggleFollowUser(data.id, data.isFollowing);

  return (
    <>
      <Button
        variant='tinted'
        color={isFollowing ? 'danger' : 'primary'}
        onClick={handleToggleFollow}
        isLoading={isToggleFollowPending}
      >
        {isFollowing ? t('actions.unfollow') : t('actions.follow')}
      </Button>
      <LazyConfirmModal
        title={t('user.confirmUnfollowModal.title', { name: data.name })}
        description={t('user.confirmUnfollowModal.description', { name: data.name })}
        acceptButtonText={t('actions.unfollow')}
        isOpen={isUnfollowModalOpen}
        onClose={() => setIsUnfollowModalOpen(false)}
        onAccept={handleUnfollow}
        preventClosingOnOutside={false}
      />
    </>
  );
};
