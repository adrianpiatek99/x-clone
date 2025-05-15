import './LinearProgress.css';

import type { FC } from 'react';
import React from 'react';

import { twMerge } from 'tailwind-merge';

import type { LinearProgressPosition } from './types';

export type LinearProgressProps = {
  position?: LinearProgressPosition;
};

const LinearProgress: FC<LinearProgressProps> = ({ position = 'top' }) => {
  return (
    <progress
      className={twMerge(
        'animate-appear progress absolute inset-x-[0.5px] top-0 h-[3px] w-full appearance-none border-0 bg-primary/40 text-primary z-10',
        position === 'bottom' && 'top-auto bottom-0'
      )}
    />
  );
};

export default LinearProgress;
