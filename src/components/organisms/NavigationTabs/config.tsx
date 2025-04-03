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
};

type NavigationTabItemsProps = {
  t: Translation;
  pathname: string;
};

const homeNavigationItem = ({ t, pathname }: NavigationTabItemsProps): NavigationTabItem => ({
  text: t('navigation.home'),
  href: ROUTES.HOME,
  active: pathname === ROUTES.HOME,
  icon: <HomeOutlinedIcon />,
  activeIcon: <HomeIcon />,
});

const exploreNavigationItem = ({ t, pathname }: NavigationTabItemsProps): NavigationTabItem => ({
  text: t('navigation.explore'),
  href: ROUTES.EXPLORE,
  active: pathname.includes(ROUTES.EXPLORE),
  icon: <SearchOutlinedIcon />,
  activeIcon: <SearchFilledIcon />,
});

const authNavigationItems = ({ t, pathname }: NavigationTabItemsProps): NavigationTabItem[] => [
  homeNavigationItem({ t, pathname }),
  exploreNavigationItem({ t, pathname }),
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
];

const guestNavigationItems = ({ t, pathname }: NavigationTabItemsProps): NavigationTabItem[] => [
  homeNavigationItem({ t, pathname }),
  exploreNavigationItem({ t, pathname }),
];

export const navigationTabsItems = ({
  t,
  pathname,
  isAuth,
}: NavigationTabItemsProps & { isAuth: boolean }): NavigationTabItem[] =>
  isAuth ? authNavigationItems({ t, pathname }) : guestNavigationItems({ t, pathname });
