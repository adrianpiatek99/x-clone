import type { ReactElement } from 'react';

import { ROUTES } from '@/constants/routes';
import {
  HomeIcon,
  HomeOutlinedIcon,
  MailIcon,
  MailOutlinedIcon,
  NotificationIcon,
  NotificationOutlinedIcon,
  SearchFilledIcon,
  SearchOutlinedIcon,
} from '@/icons';

export type NavigationTabItem = {
  text: string;
  href: string;
  active: boolean;
  icon: ReactElement;
  activeIcon: ReactElement;
  visible: boolean;
};

type NavigationTabItemsProps = {
  t: Translation;
  pathname: string;
  isAuth: boolean;
};

export const navigationTabsItems = ({
  t,
  pathname,
  isAuth,
}: NavigationTabItemsProps): NavigationTabItem[] =>
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
      icon: <SearchOutlinedIcon />,
      activeIcon: <SearchFilledIcon />,
      visible: true,
    },
    {
      text: t('navigation.notifications'),
      href: ROUTES.NOTIFICATIONS,
      active: pathname.includes(ROUTES.NOTIFICATIONS),
      icon: <NotificationOutlinedIcon />,
      activeIcon: <NotificationIcon />,
      visible: isAuth,
    },
    {
      text: t('navigation.messages'),
      href: ROUTES.MESSAGES,
      active: pathname.includes(ROUTES.MESSAGES),
      icon: <MailOutlinedIcon />,
      activeIcon: <MailIcon />,
      visible: isAuth,
    },
  ].filter((item) => item.visible);
