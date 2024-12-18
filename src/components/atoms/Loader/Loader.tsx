import type { FC } from 'react';

import { twMerge } from 'tailwind-merge';

import type { LoaderClassesReturn, LoaderColor } from './Loader.types';

export type LoaderProps = {
  center?: boolean;
  color?: LoaderColor;
  className?: string;
};

const classes: LoaderClassesReturn = {
  color: {
    primary: 'border-y-primary/25 border-l-primary border-r-primary/25',
    white: 'border-y-[#fff]/25 border-l-[#fff] border-r-[#fff]/25',
    danger: 'border-y-error-1/25 border-l-error-1 border-r-error-1/25',
  },
};

export const Loader: FC<LoaderProps> = ({ center = false, color = 'primary', className = '' }) => {
  return (
    <div
      className={twMerge(
        'relative flex size-[10em] animate-spin rounded-full border-[3px] indent-[-9999px] text-[2.5px] duration-200',
        classes.color[color],
        center && 'mx-auto',
        className
      )}
    />
  );
};
