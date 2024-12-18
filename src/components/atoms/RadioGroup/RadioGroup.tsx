import type { FC, ReactNode } from 'react';
import React from 'react';

import { Typography } from '../Typography';

export type RadioGroupProps = {
  children: ReactNode;
  title?: string;
};

export const RadioGroup: FC<RadioGroupProps> = ({ children, title }) => {
  return (
    <div className='flex w-full flex-col gap-2'>
      {title && (
        <Typography size='l' color='secondary' className='break-words'>
          {title}
        </Typography>
      )}
      <div className='flex w-full flex-col gap-0 rounded-xl border border-border-2'>{children}</div>
    </div>
  );
};
