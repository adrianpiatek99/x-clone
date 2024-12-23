import type { FC, ReactNode } from 'react';
import React from 'react';

import { Link } from '@/i18n/routing';
import { twMerge } from 'tailwind-merge';

export type TabProps = {
  children: ReactNode;
  value: string;
  href?: string;
  selected?: boolean;
  onClick?: () => void;
};

export const Tab: FC<TabProps> = ({ children, href, onClick, selected = false }) => {
  const Component = href ? Link : 'button';

  const handleClick = () => !selected && onClick?.();

  return (
    <Component
      className={twMerge(
        'relative flex w-full cursor-pointer items-center justify-center px-4 text-m font-medium text-text-1 transition hover:bg-text-1/10 focus-visible:bg-text-1/10 active:bg-text-1/15 duration-200 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus',
        selected && 'cursor-default active:bg-text-1/10'
      )}
      onClick={handleClick}
      href={href && !selected ? href : ''}
      role='tab'
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      {...(href ? { scroll: false } : { type: 'button' })}
    >
      {children}
    </Component>
  );
};
