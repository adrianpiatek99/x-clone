import React from 'react';

import IconButton from '@/components/atoms/IconButton';
import { useAuth } from '@/components/context/AuthContext';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { ScrollDirection } from '@/hooks/useScrollDirection';
import { usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

import { navigationTabsItems } from './config';
import { NavigationTabsCreatePost } from './NavigationTabsCreatePost';
import { NavigationTabsDrawerButton } from './NavigationTabsDrawerButton';

const NavigationTabs = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const { user } = useAuth();
  const scrollDirection = useScrollDirection();
  const isScrollDirectionDown = scrollDirection === ScrollDirection.DOWN;
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div
      className={twMerge(
        'fixed inset-x-0 bottom-0 z-9 flex border-t border-border-1 bg-background/75 pb-[calc(env(safe-area-inset-bottom))] backdrop-blur-md transition duration-200 sm:hidden',
        isScrollDirectionDown && 'opacity-30'
      )}
    >
      <div className='relative mx-auto flex h-[52px] w-full max-w-[580px] shrink-0 items-center px-4'>
        <nav className='flex size-full items-center' role='navigation'>
          {navigationTabsItems({ t, pathname, isAuth: !!user }).map((item) => {
            if ('children' in item)
              return <React.Fragment key={item.key}>{item.children}</React.Fragment>;

            const { href, text, active, activeIcon, icon } = item;

            return (
              <IconButton
                linkClassName='flex items-center justify-center w-full'
                key={href}
                href={href}
                color='white'
                size='large'
                aria-label={text}
              >
                {active ? activeIcon : icon}
              </IconButton>
            );
          })}
          <NavigationTabsDrawerButton />
        </nav>
      </div>
      {user && <NavigationTabsCreatePost />}
    </div>
  );
};

export default NavigationTabs;
