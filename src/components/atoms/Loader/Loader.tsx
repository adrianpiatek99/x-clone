import './styles.css';

import type { FC } from 'react';

import { createArray } from '@/utils/array';
import { twMerge } from 'tailwind-merge';

import type { LoaderClassesReturn, LoaderColor } from './types';

export type LoaderProps = {
  center?: boolean;
  className?: string;
  color?: LoaderColor;
  size?: 'small' | 'medium' | 'large';
};

const classes: LoaderClassesReturn = {
  color: {
    primary: 'text-loader',
    secondary: 'text-text-1',
  },
  size: {
    small: 'size-[22px]',
    medium: 'size-[32px]',
    large: 'size-[48px]',
  },
};

const Loader: FC<LoaderProps> = ({
  center = false,
  className = '',
  color = 'primary',
  size = 'medium',
}) => {
  return (
    <div
      className={twMerge(
        'relative flex shrink-0',
        classes.color[color],
        classes.size[size],
        center && 'mx-auto',
        className
      )}
    >
      <svg viewBox='0 0 50 50' className='size-full'>
        {createArray(12).map((number) => (
          <line
            key={number}
            x1='25'
            y1='25'
            x2='33'
            y2='25'
            transform={`rotate(${number * 30} 25 25) translate(11 0)`}
            strokeLinecap='round'
            style={{
              stroke: 'currentColor',
              strokeWidth: 3.5,
              animation: 'spinner-fade 800ms linear infinite',
              animationDelay: `${-733 + number * 66.67}ms`,
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export default Loader;
