import React from 'react';

import Avatar from '@/components/atoms/Avatar';
import { useAuth } from '@/components/context/AuthContext';
import { ROUTES } from '@/constants/routes';

type Props = {
  withLink?: boolean;
};

const UserAvatar = ({ withLink = true }: Props) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Avatar
      src={user.avatarUrl}
      screenName={user.screenName}
      href={withLink ? ROUTES.PROFILE.DETAILS(user.screenName) : undefined}
    />
  );
};

export default UserAvatar;
