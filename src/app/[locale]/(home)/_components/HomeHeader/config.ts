import type { TabProps } from '@/components/molecules/Tabs';
import { ROUTES } from '@/constants/routes';
import { HomeTab } from '@/stores/home';

export const HOME_SELECTED_TAB_KEY = 'homeSelectedTab';

export const getHomeTabs = ({ t, isAuth }: { t: Translation; isAuth: boolean }) =>
  [
    {
      value: HomeTab.GLOBAL,
      children: t('homePage.tabs.global'),
      href: ROUTES.HOME,
    },
    {
      value: HomeTab.FOLLOWING,
      children: t('homePage.tabs.following'),
      href: ROUTES.HOME,
      disabled: !isAuth,
    },
  ] satisfies TabProps<HomeTab>[];
