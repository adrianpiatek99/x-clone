import React, { Suspense, useState } from 'react';

import Button from '@/components/atoms/Button';
import Icon from '@/components/atoms/Icon';
import { useGetUserByScreenNameQuery } from '@/hooks/api/profile/useGetUserByScreenNameQuery';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import type { ProfileParams } from '../../layout';

const LazyEditProfileModal = React.lazy(() => import('@/components/organisms/EditProfileModal'));

export const ProfileHeroActions = () => {
  const t = useTranslations();
  const { screenName } = useParams<ProfileParams>();
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
        <Button variant='tinted'>{t('actions.follow')}</Button>
      )}
      {isMe && (
        <Suspense>
          <LazyEditProfileModal
            isOpen={isEditProfileModalOpen}
            onClose={() => setIsEditProfileModalOpen(false)}
            user={data}
          />
        </Suspense>
      )}
    </>
  );
};
