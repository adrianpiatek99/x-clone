import type { TabProps } from '@/components/molecules/Tabs';
import { ROUTES } from '@/constants/routes';

export const getProfileTabs = ({ t, screenName }: { t: Translation; screenName: string }) =>
  [
    {
      value: ROUTES.PROFILE.DETAILS(screenName),
      children: t('profilePage.tabs.posts'),
      href: ROUTES.PROFILE.DETAILS(screenName),
    },
    {
      value: ROUTES.PROFILE.REPLIES(screenName),
      children: t('profilePage.tabs.replies'),
      href: ROUTES.PROFILE.REPLIES(screenName),
    },
    {
      value: ROUTES.PROFILE.MEDIA(screenName),
      children: t('profilePage.tabs.media'),
      href: ROUTES.PROFILE.MEDIA(screenName),
    },
    {
      value: ROUTES.PROFILE.LIKES(screenName),
      children: t('profilePage.tabs.likes'),
      href: ROUTES.PROFILE.LIKES(screenName),
    },
  ] satisfies TabProps<string>[];
