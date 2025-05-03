import type { ReactElement } from 'react';

import Icon from '@/components/atoms/Icon';
import { ROUTES } from '@/constants/routes';
import type { User } from '@/db/schema';

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
      icon: <Icon name='HomeOutlinedIcon' />,
      activeIcon: <Icon name='HomeIcon' />,
      visible: true,
    },
    {
      text: t('navigation.explore'),
      href: ROUTES.EXPLORE,
      active: pathname.includes(ROUTES.EXPLORE),
      icon: <Icon name='SearchOutlinedIcon' />,
      activeIcon: <Icon name='SearchFilledIcon' />,
      visible: !!user,
    },
    {
      text: t('navigation.notifications'),
      href: ROUTES.NOTIFICATIONS,
      active: pathname.includes(ROUTES.NOTIFICATIONS),
      icon: <Icon name='NotificationOutlinedIcon' />,
      activeIcon: <Icon name='NotificationIcon' />,
      visible: !!user,
    },
    {
      text: t('navigation.messages'),
      href: ROUTES.MESSAGES,
      active: pathname.includes(ROUTES.MESSAGES),
      icon: <Icon name='MailOutlinedIcon' />,
      activeIcon: <Icon name='MailIcon' />,
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
      text: t('navigation.profile'),
      href: user ? ROUTES.PROFILE.DETAILS(user.screenName) : '',
      active: user ? pathname.includes(ROUTES.PROFILE.DETAILS(user.screenName)) : false,
      icon: <Icon name='PersonOutlinedIcon' />,
      activeIcon: <Icon name='PersonIcon' />,
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
