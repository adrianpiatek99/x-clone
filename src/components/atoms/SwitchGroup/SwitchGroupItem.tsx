import type { ComponentPropsWithRef, ForwardedRef, ReactElement } from 'react';
import React, { forwardRef } from 'react';

import { Switch } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';

import { Typography } from '../Typography';

export type SwitchGroupItemProps = ComponentPropsWithRef<typeof Switch> & {
  children?: ReactElement;
  name: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label: string;
  description?: string;
};

export const SwitchGroupItem = forwardRef(
  (
    { children, checked, label, name, disabled, description, ...props }: SwitchGroupItemProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    return (
      <div
        className={twMerge(
          'flex w-full pl-4 [&>*]:last:border-none bg-input-background first:rounded-t-xl last:rounded-b-xl duration-200',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {children && <div className='py-3 pr-3'>{children}</div>}
        <div className='flex w-full border-b border-border-2 py-3 pr-4'>
          <div className='flex w-full flex-col gap-1 pr-3'>
            <Typography>{label}</Typography>
            {description && (
              <Typography size='xs' color='secondary'>
                {description}
              </Typography>
            )}
          </div>
          <Switch
            className='group relative flex h-[26px] w-[44px] shrink-0 rounded-full bg-switch-background-inactive transition-colors duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-focus enabled:hover:bg-switch-background-inactive/90 disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:border-primary data-[checked]:bg-primary data-[checked]:enabled:hover:bg-primary/90'
            name={name}
            checked={checked}
            disabled={disabled}
            {...props}
            ref={ref}
          >
            <span
              className={twMerge(
                'absolute m-[2px] inset-0 block w-[calc(50%)] rounded-full bg-switch-dot shadow-lg duration-200 ease-in-out',
                checked ? 'translate-x-[calc(100%-4px)] origin-right' : 'origin-left'
              )}
            />
          </Switch>
        </div>
      </div>
    );
  }
);
