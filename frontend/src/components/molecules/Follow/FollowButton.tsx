import React, { useState } from 'react';

import Button from '@/components/atoms/Button';
import { useToggleFollowUserMutation } from '@/hooks/api/users/mutations';
import type { ProfileUser } from '@/types/user';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

const LazyConfirmModal = dynamic(
  () => import('@/components/atoms/ConfirmModal').then((mod) => mod.ConfirmModal),
  {
    ssr: false,
  }
);

type Props = {
  isMe: boolean;
  profileUserData: Pick<ProfileUser, 'id' | 'name' | 'screenName' | 'isFollowing'>;
};

export const FollowButton = ({
  isMe,
  profileUserData: { id, name, screenName, isFollowing },
}: Props) => {
  const t = useTranslations();
  const [isUnfollowModalOpen, setIsUnfollowModalOpen] = useState(false);
  const { toggleFollowUser, isToggleFollowPending } = useToggleFollowUserMutation({
    screenName,
    userId: id,
  });

  if (isMe) return null;

  const handleUnfollow = () => {
    setIsUnfollowModalOpen(false);
    toggleFollowUser(isFollowing);
  };

  const handleToggleFollow = () =>
    isFollowing ? setIsUnfollowModalOpen(true) : toggleFollowUser(isFollowing);

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
        title={t('user.confirmUnfollowModal.title', { name })}
        description={t('user.confirmUnfollowModal.description', { name })}
        acceptButtonText={t('actions.unfollow')}
        isOpen={isUnfollowModalOpen}
        onClose={() => setIsUnfollowModalOpen(false)}
        onAccept={handleUnfollow}
        preventClosingOnOutside={false}
      />
    </>
  );
};
