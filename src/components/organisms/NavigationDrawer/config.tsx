import type { ReactElement } from 'react';

import { ROUTES } from '@/constants/routes';
import type { User } from '@/db/schema';
import {
  BookmarkIcon,
  BookmarkOutlinedIcon,
  PersonIcon,
  PersonOutlinedIcon,
  SettingsIcon,
  SettingsOutlinedIcon,
} from '@/icons';

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
      icon: <PersonOutlinedIcon />,
      activeIcon: <PersonIcon />,
      visible: !!user,
    },
    {
      text: t('navigation.bookmarks'),
      href: ROUTES.BOOKMARKS,
      active: pathname.includes(ROUTES.BOOKMARKS),
      icon: <BookmarkOutlinedIcon />,
      activeIcon: <BookmarkIcon />,
      visible: !!user,
    },
    {
      text: t('navigation.settings'),
      href: ROUTES.SETTINGS,
      active: pathname.includes(ROUTES.SETTINGS),
      icon: <SettingsOutlinedIcon />,
      activeIcon: <SettingsIcon />,
      visible: true,
    },
  ].filter((item) => item.visible);
