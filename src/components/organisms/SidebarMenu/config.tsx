import type { ReactElement } from 'react';

import { ROUTES } from '@/constants/routes';
import type { User } from '@/db/schema';
import {
  BookmarkIcon,
  BookmarkOutlinedIcon,
  HashtagIcon,
  HashtagOutlinedIcon,
  HomeIcon,
  HomeOutlinedIcon,
  MailIcon,
  MailOutlinedIcon,
  NotificationIcon,
  NotificationOutlinedIcon,
  PersonIcon,
  PersonOutlinedIcon,
  SettingsIcon,
  SettingsOutlinedIcon,
} from '@/icons';

export type SidebarMenuItem = {
  text: string;
  href: string;
  active: boolean;
  icon: ReactElement;
  activeIcon: ReactElement;
  visible: boolean;
};

type SidebarMenuItemsProps = {
  t: Translation;
  user: User | undefined;
  pathname: string;
};

export const sidebarMenuItems = ({ t, user, pathname }: SidebarMenuItemsProps): SidebarMenuItem[] =>
  [
    {
      text: t('navigation.home'),
      href: ROUTES.HOME,
      active: pathname === ROUTES.HOME,
      icon: <HomeOutlinedIcon />,
      activeIcon: <HomeIcon />,
      visible: true,
    },
    {
      text: t('navigation.explore'),
      href: ROUTES.EXPLORE,
      active: pathname.includes(ROUTES.EXPLORE),
      icon: <HashtagOutlinedIcon />,
      activeIcon: <HashtagIcon />,
      visible: !!user,
    },
    {
      text: t('navigation.notifications'),
      href: ROUTES.NOTIFICATIONS,
      active: pathname.includes(ROUTES.NOTIFICATIONS),
      icon: <NotificationOutlinedIcon />,
      activeIcon: <NotificationIcon />,
      visible: !!user,
    },
    {
      text: t('navigation.messages'),
      href: ROUTES.MESSAGES,
      active: pathname.includes(ROUTES.MESSAGES),
      icon: <MailOutlinedIcon />,
      activeIcon: <MailIcon />,
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
      text: t('navigation.profile'),
      href: user ? ROUTES.PROFILE.DETAILS(user.screenName) : '',
      active: user ? pathname.includes(ROUTES.PROFILE.DETAILS(user.screenName)) : false,
      icon: <PersonOutlinedIcon />,
      activeIcon: <PersonIcon />,
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
