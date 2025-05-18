import React, { useState } from 'react';

import Button from '@/components/atoms/Button';
import Icon from '@/components/atoms/Icon';
import { FollowButton } from '@/components/molecules/Follow';
import { useGetUserByScreenNameQuery } from '@/hooks/api/profile/queries';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import type { ProfilePageParams } from '../../../layout';

const LazyEditProfileModal = dynamic(() => import('@/components/organisms/EditProfileModal'), {
  ssr: false,
});

export const ProfileHeroActions = () => {
  const t = useTranslations();
  const { screenName } = useParams<ProfilePageParams>();
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const { data, isMe } = useGetUserByScreenNameQuery({
    screenName,
    enabled: false,
  });

  if (!data) return null;

  return (
    <>
      {isMe ? (
        <Button
          variant='gray'
          startIcon={<Icon name='EditIcon' />}
          onClick={() => setIsEditProfileModalOpen(true)}
        >
          {t('profilePage.actions.edit')}
        </Button>
      ) : (
        <FollowButton isMe={isMe} profileUserData={data} />
      )}
      {isMe && (
        <LazyEditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          user={data}
        />
      )}
    </>
  );
};
