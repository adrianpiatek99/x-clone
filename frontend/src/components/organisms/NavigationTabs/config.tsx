import type { ReactElement } from 'react';

import Icon from '@/components/atoms/Icon';
import { ROUTES } from '@/constants/routes';

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
    {
      text: t('navigation.notifications'),
      href: ROUTES.NOTIFICATIONS,
      active: pathname.includes(ROUTES.NOTIFICATIONS),
      icon: <Icon name='NotificationOutlinedIcon' />,
      activeIcon: <Icon name='NotificationIcon' />,
      visible: isAuth,
    },
    {
      text: t('navigation.messages'),
      href: ROUTES.MESSAGES,
      active: pathname.includes(ROUTES.MESSAGES),
      icon: <Icon name='MailOutlinedIcon' />,
      activeIcon: <Icon name='MailIcon' />,
      visible: isAuth,
    },
  ].filter((item) => item.visible);
