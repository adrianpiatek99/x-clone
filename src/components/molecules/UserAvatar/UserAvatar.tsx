import React from 'react';

import { Avatar } from '@/components/atoms/Avatar';
import { ROUTES } from '@/constants/routes';
import { useAppSession } from '@/hooks/useAppSession';

const UserAvatar = () => {
  const { user } = useAppSession();

  if (!user) return null;

  return (
    <Avatar
      src={user.profileImageUrl}
      screenName={user.screenName}
      href={ROUTES.PROFILE.DETAILS(user.screenName)}
    />
  );
};

export default UserAvatar;
