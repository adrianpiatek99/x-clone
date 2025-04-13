import React, { useCallback, useEffect } from 'react';

import Tabs, { Tab } from '@/components/molecules/Tabs';
import { useAppSession } from '@/hooks/useAppSession';
import { HomeTab, useHomeStore } from '@/stores/home';
import { useTranslations } from 'next-intl';
import { useShallow } from 'zustand/shallow';

import { getHomeTabs, HOME_SELECTED_TAB_KEY } from './config';

const HomeTabBar = () => {
  const t = useTranslations();
  const { user } = useAppSession();
  const { currentTab, update } = useHomeStore(
    useShallow((state) => ({
      currentTab: state.currentTab,
      update: state.update,
    }))
  );
  const tabs = getHomeTabs({ t, isAuth: !!user });

  const handleTabChange = useCallback(
    (tab: HomeTab) => {
      update({ currentTab: tab });
      localStorage.setItem(HOME_SELECTED_TAB_KEY, tab);
      scrollTo({ top: 0 });
    },
    [update]
  );

  useEffect(() => {
    const savedTab = localStorage.getItem(HOME_SELECTED_TAB_KEY) as HomeTab | null;
    const selectedTab =
      savedTab && Object.values(HomeTab).includes(savedTab) ? savedTab : HomeTab.FOLLOWING;

    const targetTab = tabs.find((tab) => tab.value === selectedTab);

    if (targetTab?.disabled) {
      const firstEnabledTab = tabs.find((tab) => !tab.disabled);

      if (firstEnabledTab) {
        handleTabChange(firstEnabledTab.value);

        return;
      }
    }

    handleTabChange(selectedTab);
  }, [tabs, handleTabChange]);

  return (
    <div className='sticky top-0 z-10 flex w-full flex-col bg-background/65 backdrop-blur-md'>
      {currentTab && (
        <Tabs value={currentTab} onChange={handleTabChange}>
          {tabs.map((tab) => (
            <Tab key={tab.value} value={tab.value} disabled={tab.disabled}>
              {tab.label}
            </Tab>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default HomeTabBar;
