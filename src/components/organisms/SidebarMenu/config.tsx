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
};

type SidebarMenuItemsProps = {
  t: Translation;
  user: User;
  pathname: string;
};

export const sidebarMenuHomeItem = ({
  t,
  pathname,
}: Omit<SidebarMenuItemsProps, 'user'>): SidebarMenuItem => ({
  text: t('navigation.home'),
  href: ROUTES.HOME,
  active: pathname === ROUTES.HOME,
  icon: <HomeOutlinedIcon />,
  activeIcon: <HomeIcon />,
});

export const sidebarMenuSettingsItem = ({
  t,
  pathname,
}: Omit<SidebarMenuItemsProps, 'user'>): SidebarMenuItem => ({
  text: t('navigation.settings'),
  href: ROUTES.SETTINGS,
  active: pathname.includes(ROUTES.SETTINGS),
  icon: <SettingsOutlinedIcon />,
  activeIcon: <SettingsIcon />,
});

export const authSidebarMenuItems = ({
  t,
  user,
  pathname,
}: SidebarMenuItemsProps): SidebarMenuItem[] => [
  {
    text: t('navigation.explore'),
    href: ROUTES.EXPLORE,
    active: pathname.includes(ROUTES.EXPLORE),
    icon: <HashtagOutlinedIcon />,
    activeIcon: <HashtagIcon />,
  },
  {
    text: t('navigation.notifications'),
    href: ROUTES.NOTIFICATIONS,
    active: pathname.includes(ROUTES.NOTIFICATIONS),
    icon: <NotificationOutlinedIcon />,
    activeIcon: <NotificationIcon />,
  },
  {
    text: t('navigation.messages'),
    href: ROUTES.MESSAGES,
    active: pathname.includes(ROUTES.MESSAGES),
    icon: <MailOutlinedIcon />,
    activeIcon: <MailIcon />,
  },
  {
    text: t('navigation.bookmarks'),
    href: ROUTES.BOOKMARKS,
    active: pathname.includes(ROUTES.BOOKMARKS),
    icon: <BookmarkOutlinedIcon />,
    activeIcon: <BookmarkIcon />,
  },
  {
    text: t('navigation.profile'),
    href: ROUTES.PROFILE.DETAILS(user.screenName),
    active: pathname.includes(ROUTES.PROFILE.DETAILS(user.screenName)),
    icon: <PersonOutlinedIcon />,
    activeIcon: <PersonIcon />,
  },
];
