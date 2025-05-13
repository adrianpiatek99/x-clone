import type { ReactElement } from 'react';

import Icon from '@/components/atoms/Icon';
import { ROUTES } from '@/constants/routes';

import { NavigationTabsCreatePost } from './NavigationTabsCreatePost';

export type NavigationTabItem =
  | { key: string; children: ReactElement; visible: boolean }
  | {
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
      visible: true,
    },
    { key: 'create-post', children: <NavigationTabsCreatePost />, visible: isAuth },
    {
      text: t('navigation.notifications'),
      href: ROUTES.NOTIFICATIONS,
      active: pathname.includes(ROUTES.NOTIFICATIONS),
      icon: <Icon name='NotificationOutlinedIcon' />,
      activeIcon: <Icon name='NotificationIcon' />,
      visible: isAuth,
    },
  ].filter((item) => item.visible);
