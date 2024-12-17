import type { ComponentPropsWithRef, ForwardedRef } from 'react';
import React, { forwardRef } from 'react';

import { twMerge } from 'tailwind-merge';

import { Typography } from '../Typography';

export type CheckboxProps = Omit<ComponentPropsWithRef<'input'>, 'type' | 'size'> & {
  name: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
};

export const Checkbox = forwardRef(
  (
    { checked, name, label, description, onChange, disabled = false, ...props }: CheckboxProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <div className='flex w-full flex-col gap-3'>
        <div className='group flex w-full flex-row items-center'>
          {label && (
            <label
              className={twMerge(
                'cursor-pointer w-full min-w-0 truncate pr-3',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              htmlFor={name}
            >
              <Typography weight='medium'>{label}</Typography>
            </label>
          )}
          <input
            className='size-[20px] shrink-0 cursor-pointer appearance-none rounded border-2 border-text-2 outline-none duration-200 checked:border-primary checked:bg-primary checked:after:absolute checked:after:ml-[4px] checked:after:h-[12px] checked:after:w-[7px] checked:after:rotate-45 checked:after:border-2 checked:after:border-l-0 checked:after:border-t-0 checked:after:border-foreground focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50 enabled:group-hover:border-primary enabled:checked:group-hover:border-primary/20 enabled:checked:group-hover:bg-primary/75 enabled:group-active:border-primary/60 enabled:checked:group-active:bg-primary/60'
            id={name}
            name={name}
            type='checkbox'
            checked={checked}
            onChange={({ target }) => onChange?.(target.checked)}
            disabled={disabled}
            {...props}
            ref={ref}
          />
        </div>
        {description && (
          <Typography size='s' color='secondary' className='break-words'>
            {description}
          </Typography>
        )}
      </div>
    );
  }
);
