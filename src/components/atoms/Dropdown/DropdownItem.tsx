'use client';

import type { FC, HTMLProps, ReactElement } from 'react';
import React, { cloneElement } from 'react';

import { MenuItem } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';

import { Loader } from '../Loader';
import { Typography } from '../Typography';

export type DropdownItemProps = {
  children: string;
  icon: ReactElement<HTMLProps<HTMLElement>>;
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  danger?: boolean;
};

export const DropdownItem: FC<DropdownItemProps> = ({
  children,
  icon,
  onClick,
  isLoading = false,
  disabled = false,
  danger = false,
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <MenuItem disabled={isDisabled}>
      <button
        className='group flex w-full items-center justify-between gap-3 border-b border-dropdown-border px-4 py-3 duration-200 last:border-none enabled:active:bg-text-1/15 disabled:cursor-not-allowed disabled:opacity-50 data-[focus]:bg-text-1/10'
        onClick={onClick}
        disabled={isDisabled}
      >
        <Typography
          className={twMerge(
            '[color:theme("colors.text-1")]',
            danger && '[color:theme("colors.error-1")]'
          )}
        >
          {children}
        </Typography>
        {isLoading ? (
          <Loader className='size-[18px]' />
        ) : (
          cloneElement(icon, {
            className: twMerge(
              'size-[18px] fill-text-1 text-text-1',
              danger && 'text-error-1 fill-error-1'
            ),
          })
        )}
      </button>
    </MenuItem>
  );
};
