import type { FC } from 'react';
import React from 'react';

import { twMerge } from 'tailwind-merge';

import Icon from '../Icon';
import IconButton from '../IconButton';
import type { LogoClassesReturn, LogoColor, LogoSize } from './types';

export type LogoProps = {
  href?: string;
  size?: LogoSize;
  color?: LogoColor;
  className?: string;
};

const classes: LogoClassesReturn = {
  size: {
    s: '[&>svg]:size-[16px]',
    m: '[&>svg]:size-[20px]',
    l: '[&>svg]:size-[24px]',
    xl: '[&>svg]:size-[28px]',
  },
  color: {
    primary: '[&>svg]:fill-neutral',
    secondary: '',
  },
};

const Logo: FC<LogoProps> = ({ href, size = 'm', color = 'primary', className = '' }) => {
  return href ? (
    <IconButton
      href={href}
      color='white'
      className={twMerge('', classes.size[size], classes.color[color], className)}
    >
      <Icon name='TwitterXIcon' />
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
      <Icon name='TwitterXIcon' />
    </div>
  );
};

export default Logo;
