'use client';

import type { FC, ReactElement } from 'react';
import React from 'react';

import { Menu, MenuButton, MenuItems } from '@headlessui/react';

export type DropdownProps = {
  children: ReactElement[];
};

export const Dropdown: FC<DropdownProps> = ({ children }) => {
  const items = children.slice(1);

  return (
    <Menu>
      <MenuButton className='w-fit' tabIndex={-1}>
        {children[0]}
      </MenuButton>
      <MenuItems
        className='w-[220px] origin-top-right rounded-xl bg-dropdown-background/90 shadow-lg backdrop-blur-md transition duration-200 focus:outline-none data-[closed]:scale-10 data-[leave]:scale-15 data-[closed]:opacity-0 data-[leave]:duration-150'
        transition
        anchor={{ to: 'bottom end', gap: '6px' }}
      >
        {items}
      </MenuItems>
    </Menu>
  );
};
