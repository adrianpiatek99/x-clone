import type { ForwardedRef, ReactElement } from 'react';
import React, { forwardRef } from 'react';

import { twMerge } from 'tailwind-merge';

import { Typography } from '../Typography';
import type { RadioProps } from './Radio';
import { Radio } from './Radio';

export type RadioGroupItemProps = RadioProps & {
  children?: ReactElement;
  label: string;
  description?: string;
};

export const RadioGroupItem = forwardRef(
  (
    {
      children,
      value,
      checked,
      label,
      description,
      disabled = false,
      ...props
    }: RadioGroupItemProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <label
        className={twMerge(
          'flex w-full pl-4 [&>*]:last:border-none bg-input-background first:rounded-t-xl last:rounded-b-xl cursor-pointer duration-200',
          disabled && 'opacity-50 cursor-not-allowed',
          checked ? 'cursor-default' : 'enabled:hover:bg-text-1/10 enabled:active:bg-text-1/10'
        )}
        htmlFor={String(value)}
      >
        {children && <div className='py-3 pr-3'>{children}</div>}
        <div className='flex w-full items-center border-b border-border-2 py-3 pr-4'>
          <div className='flex w-full flex-col gap-1 pr-3'>
            <Typography>{label}</Typography>
            {description && (
              <Typography size='xs' color='secondary'>
                {description}
              </Typography>
            )}
          </div>
          <Radio value={value} checked={checked} disabled={disabled} {...props} ref={ref} />
        </div>
      </label>
    );
  }
);
