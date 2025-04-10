import React from 'react';

import Avatar from '@/components/atoms/Avatar';
import { ROUTES } from '@/constants/routes';
import { useAppSession } from '@/hooks/useAppSession';

type Props = {
  withLink?: boolean;
};

const UserAvatar = ({ withLink = true }: Props) => {
  const { user } = useAppSession();

  if (!user) return null;

  return (
    <Avatar
      src={user.profileImageUrl}
      screenName={user.screenName}
      href={withLink ? ROUTES.PROFILE.DETAILS(user.screenName) : undefined}
    />
  );
};

export default UserAvatar;
