import type { FC } from 'react';
import React from 'react';

import { twMerge } from 'tailwind-merge';

import type { SkeletonClasses, SkeletonVariant } from './Skeleton.types';

export type SkeletonProps = {
  height?: number;
  width?: number;
  variant?: SkeletonVariant;
  absolute?: boolean;
  withoutRadius?: boolean;
};

const classes: SkeletonClasses = {
  variant: {
    circular: 'rounded-full',
    rect: 'rounded-2xl',
  },
};

export const Skeleton: FC<SkeletonProps> = ({
  height,
  width,
  variant = 'rect',
  absolute = false,
  withoutRadius = false,
}) => {
  return (
    <div
      style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : '100%' }}
      className={twMerge(
        'relative shrink-0 w-full overflow-hidden bg-skeleton [inset:none]',
        classes.variant[variant],
        absolute && 'absolute inset-0',
        withoutRadius && 'rounded-none'
      )}
    >
      <div className="absolute left-0 top-0 size-full animate-swipe bg-[linear-gradient(90deg,transparent,theme('colors.skeleton-swipe'),transparent)] bg-no-repeat" />
    </div>
  );
};
