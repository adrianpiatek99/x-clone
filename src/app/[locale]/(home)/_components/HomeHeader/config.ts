import { HomeTab } from '@/stores/home';

export const HOME_SELECTED_TAB_KEY = 'homeSelectedTab';

type TabConfig = {
  value: HomeTab;
  label: string;
  disabled?: boolean;
};

export const getHomeTabs = ({ t, isAuth }: { t: Translation; isAuth: boolean }) =>
  [
    {
      value: HomeTab.GLOBAL,
      label: t('homePage.tabs.global'),
    },
    {
      value: HomeTab.FOLLOWING,
      label: t('homePage.tabs.following'),
      disabled: !isAuth,
    },
  ] satisfies TabConfig[];
