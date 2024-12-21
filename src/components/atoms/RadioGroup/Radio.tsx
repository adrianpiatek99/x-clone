import type { ComponentPropsWithRef, ReactElement, RefCallback } from 'react';
import React from 'react';

import { twMerge } from 'tailwind-merge';

import { Typography } from '../Typography';

export type RadioProps = Omit<ComponentPropsWithRef<'input'>, 'type' | 'size'> & {
  children?: ReactElement;
  value: string | number;
  name: string;
  label: string;
  description?: string;
  ref?: RefCallback<HTMLInputElement>;
};

export const Radio = ({
  children,
  value,
  checked,
  label,
  description,
  disabled = false,
  ...props
}: RadioProps) => {
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
        <input
          className={
            'relative size-[20px] shrink-0 cursor-pointer appearance-none rounded-full border-2 border-text-2 outline-none duration-200 checked:cursor-default checked:border-primary checked:bg-primary checked:after:absolute checked:after:ml-[5px] checked:after:mt-px checked:after:h-[11px] checked:after:w-[6px] checked:after:rotate-45 checked:after:border-2 checked:after:border-l-0 checked:after:border-t-0 checked:after:border-white focus-visible:shadow-focus focus-visible:ring-2 focus-visible:ring-focus enabled:hover:border-primary enabled:checked:hover:border-primary/75 disabled:cursor-not-allowed'
          }
          type='radio'
          id={String(value)}
          value={value}
          checked={checked}
          disabled={disabled}
          {...props}
        />
      </div>
    </label>
  );
};
