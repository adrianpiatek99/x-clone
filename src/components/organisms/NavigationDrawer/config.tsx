import type { ReactElement } from 'react';

import Icon from '@/components/atoms/Icon';
import { ROUTES } from '@/constants/routes';
import type { User } from '@/db/schema';

export type NavigationDrawerItem = {
  text: string;
  href: string;
  active: boolean;
  icon: ReactElement;
  activeIcon: ReactElement;
  visible: boolean;
};

type NavigationDrawerItemsProps = {
  t: Translation;
  user: User | undefined;
  pathname: string;
};

export const navigationDrawerItems = ({
  t,
  user,
  pathname,
}: NavigationDrawerItemsProps): NavigationDrawerItem[] =>
  [
    {
      text: t('navigation.profile'),
      href: user ? ROUTES.PROFILE.DETAILS(user.screenName) : '',
      active: user ? pathname.includes(ROUTES.PROFILE.DETAILS(user.screenName)) : false,
      icon: <Icon name='PersonOutlinedIcon' />,
      activeIcon: <Icon name='PersonIcon' />,
      visible: !!user,
    },
    {
      text: t('navigation.bookmarks'),
      href: ROUTES.BOOKMARKS,
      active: pathname.includes(ROUTES.BOOKMARKS),
      icon: <Icon name='BookmarkOutlinedIcon' />,
      activeIcon: <Icon name='BookmarkIcon' />,
      visible: !!user,
    },
    {
      text: t('navigation.settings'),
      href: ROUTES.SETTINGS,
      active: pathname.includes(ROUTES.SETTINGS),
      icon: <Icon name='SettingsOutlinedIcon' />,
      activeIcon: <Icon name='SettingsIcon' />,
      visible: true,
    },
  ].filter((item) => item.visible);
