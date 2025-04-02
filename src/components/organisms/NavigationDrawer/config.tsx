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
};

type NavigationDrawerItemsProps = {
  t: Translation;
  user: User;
  pathname: string;
};

export const navigationDrawerSettingsItem = ({
  t,
  pathname,
}: Omit<NavigationDrawerItemsProps, 'user'>) => ({
  text: t('navigation.settings'),
  href: ROUTES.SETTINGS,
  active: pathname.includes(ROUTES.SETTINGS),
  icon: <SettingsOutlinedIcon />,
  activeIcon: <SettingsIcon />,
});

export const navigationDrawerItems = ({
  t,
  user,
  pathname,
}: NavigationDrawerItemsProps): NavigationDrawerItem[] => [
  {
    text: t('navigation.profile'),
    href: ROUTES.PROFILE.DETAILS(user.screenName),
    active: pathname.includes(ROUTES.PROFILE.DETAILS(user.screenName)),
    icon: <PersonOutlinedIcon />,
    activeIcon: <PersonIcon />,
  },
  {
    text: t('navigation.bookmarks'),
    href: ROUTES.BOOKMARKS,
    active: pathname.includes(ROUTES.BOOKMARKS),
    icon: <BookmarkOutlinedIcon />,
    activeIcon: <BookmarkIcon />,
  },
];
