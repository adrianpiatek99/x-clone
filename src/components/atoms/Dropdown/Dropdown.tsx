'use client';

import type { FC, ReactElement } from 'react';
import React from 'react';

import { Menu, MenuButton, MenuItems } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';

export type DropdownProps = {
  children: (ReactElement | null | undefined | boolean)[];
  menuItems?: Partial<{
    className: string;
    anchorTo: 'bottom start';
  }>;
};

const Dropdown: FC<DropdownProps> = ({ children, menuItems }) => {
  const items = children.slice(1);

  return (
    <Menu as='div'>
      <MenuButton as='span' className='w-fit' tabIndex={-1}>
        {children[0]}
      </MenuButton>
      <MenuItems
        className={twMerge(
          'w-[220px] origin-top-right rounded-xl bg-accent-1/80 shadow-lg backdrop-blur-md transition duration-200 focus:outline-none data-[closed]:scale-10 data-[leave]:scale-15 data-[closed]:opacity-0 data-[leave]:duration-150',
          menuItems?.className
        )}
        transition
        anchor={{ to: menuItems?.anchorTo ?? 'bottom end', gap: '6px' }}
      >
        {items}
      </MenuItems>
    </Menu>
  );
};

export default Dropdown;
