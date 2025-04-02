import React, { cloneElement, memo } from 'react';

import { Button, IconButton } from '@/components/atoms';
import { twMerge } from 'tailwind-merge';

import type { SidebarMenuItem } from './config';

type Props = SidebarMenuItem;

const SidebarMenuListItem = memo(({ text, href, active, icon, activeIcon }: Props) => {
  const correctIcon = active ? cloneElement(activeIcon) : cloneElement(icon);

  return (
    <li>
      <IconButton
        linkClassName='flex xl:hidden'
        className='mx-auto p-3 [&>svg]:size-[26px]'
        href={href}
        title={text}
        color='white'
      >
        {correctIcon}
      </IconButton>
      <Button
        linkClassName='hidden xl:flex'
        className={twMerge(
          'min-h-[50px] gap-5 px-3 text-xl [&>svg]:size-[26px] [color:bg-foreground] rounded-full bg-transparent',
          !active && 'font-light'
        )}
        href={href}
        startIcon={correctIcon}
        variant='gray'
        size='large'
        align='left'
        fullWidth
      >
        {text}
      </Button>
    </li>
  );
});

export default SidebarMenuListItem;
