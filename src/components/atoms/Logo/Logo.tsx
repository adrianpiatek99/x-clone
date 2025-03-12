import type { FC } from 'react';
import React from 'react';

import { TwitterXIcon } from '@/icons';
import { twMerge } from 'tailwind-merge';

import { IconButton } from '../IconButton';
import type { LogoClassesReturn, LogoColor, LogoSize } from './types';

export interface LogoProps {
  href?: string;
  size?: LogoSize;
  color?: LogoColor;
  className?: string;
}

const classes: LogoClassesReturn = {
  size: {
    s: '[&>svg]:h-[16px] [&>svg]:w-[16px]',
    m: '[&>svg]:h-[20px] [&>svg]:w-[20px]',
    l: '[&>svg]:h-[24px] [&>svg]:w-[24px]',
    xl: '[&>svg]:h-[28px] [&>svg]:w-[28px]',
  },
  color: {
    primary: '[&>svg]:fill-neutral',
    secondary: '',
  },
};

export const Logo: FC<LogoProps> = ({ href, size = 'm', color = 'primary', className = '' }) => {
  return href ? (
    <IconButton
      href={href}
      color='white'
      className={twMerge('', classes.size[size], classes.color[color], className)}
    >
      <TwitterXIcon />
    </IconButton>
  ) : (
    <div
      className={twMerge(
        'grid w-min place-items-center',
        classes.size[size],
        classes.color[color],
        className
      )}
    >
      <TwitterXIcon />
    </div>
  );
};
