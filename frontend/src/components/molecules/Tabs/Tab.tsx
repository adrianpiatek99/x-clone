import type { ReactNode } from 'react';
import React from 'react';

import { Link } from '@/i18n/routing';
import { twMerge } from 'tailwind-merge';

export type TabProps<TValue> = {
  children: ReactNode;
  value: TValue;
  href?: string;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
};

export const Tab = <TValue,>({
  children,
  href,
  onClick,
  selected = false,
  disabled = false,
}: TabProps<TValue>) => {
  const handleClick = () => !selected && onClick?.();

  if (href && !disabled) {
    return (
      <Link
        className={twMerge(
          'relative flex w-full cursor-pointer items-center justify-center px-4 text-m font-medium text-text-2 transition focus-visible:bg-text-1/10 duration-200 enabled:focus-visible:ring-2 enabled:focus-visible:ring-inset enabled:focus-visible:ring-focus',
          'hover:bg-text-1/10 enabled:active:bg-text-1/15',
          selected && 'text-text-1',
          disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent'
        )}
        role='tab'
        aria-selected={selected}
        tabIndex={selected ? 0 : -1}
        onClick={handleClick}
        href={href}
        scroll={selected ? true : false}
      >
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <button
      className={twMerge(
        'relative flex w-full cursor-pointer items-center justify-center px-4 text-m font-medium text-text-2 transition focus-visible:bg-text-1/10 duration-200 enabled:focus-visible:ring-2 enabled:focus-visible:ring-inset enabled:focus-visible:ring-focus',
        selected ? 'cursor-default text-text-1' : 'hover:bg-text-1/10 enabled:active:bg-text-1/15',
        disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent'
      )}
      type='button'
      role='tab'
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      onClick={handleClick}
      disabled={disabled}
    >
      <span>{children}</span>
    </button>
  );
};
