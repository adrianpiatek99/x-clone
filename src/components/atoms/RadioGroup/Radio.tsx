import type { ComponentPropsWithRef, ForwardedRef } from 'react';
import React, { forwardRef } from 'react';

import { twMerge } from 'tailwind-merge';

export type RadioProps = Omit<ComponentPropsWithRef<'input'>, 'type' | 'size'> & {
  value: string | number;
  name: string;
};

export const Radio = forwardRef(
  (
    { value, checked, disabled = false, className, ...props }: RadioProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <input
        className={twMerge(
          'relative size-[20px] shrink-0 cursor-pointer appearance-none rounded-full border-2 border-text-2 outline-none duration-200 checked:cursor-default checked:border-primary checked:bg-primary checked:after:absolute checked:after:ml-[5px] checked:after:mt-[1px] checked:after:h-[11px] checked:after:w-[6px] checked:after:rotate-45 checked:after:border-2 checked:after:border-l-0 checked:after:border-t-0 checked:after:border-white focus-visible:shadow-focus enabled:hover:border-primary enabled:checked:hover:border-primary/75 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-focus',
          className
        )}
        type='radio'
        id={String(value)}
        value={value}
        checked={checked}
        disabled={disabled}
        {...props}
        ref={ref}
      />
    );
  }
);
