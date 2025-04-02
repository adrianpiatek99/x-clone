import React, { memo } from 'react';

import { Button } from '@/components/atoms';
import { twMerge } from 'tailwind-merge';

import type { NavigationDrawerItem } from './config';

type Props = NavigationDrawerItem & {
  onClick?: () => void;
};

const NavigationDrawerListItem = memo(
  ({ text, href, active, icon, activeIcon, onClick }: Props) => {
    return (
      <li>
        <Button
          key={href}
          className={twMerge(
            'h-[50px] w-full justify-start gap-5 rounded-none bg-transparent px-6 text-xl [color:bg-foreground] [&>svg]:size-[26px]',
            !active && 'font-light'
          )}
          href={href}
          onClick={onClick}
          startIcon={active ? activeIcon : icon}
          variant='gray'
          size='large'
        >
          {text}
        </Button>
      </li>
    );
  }
);

export default NavigationDrawerListItem;
