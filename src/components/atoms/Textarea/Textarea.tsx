import type { ComponentPropsWithRef, FC } from 'react';
import React, { useEffect, useRef } from 'react';

import { InfoOutlinedIcon } from '@/icons';
import { twMerge } from 'tailwind-merge';

import { Typography } from '../Typography';

export type TextareaProps = Omit<ComponentPropsWithRef<'textarea'>, 'placeholder'> & {
  name: string;
  label: string;
  value: string;
  isLoading?: boolean;
  onValueChange?: (value: string) => void;
  maxLength?: number;
  error?: string;
};

export const Textarea: FC<TextareaProps> = ({
  name,
  label,
  value,
  onValueChange = () => null,
  maxLength = 250,
  className = '',
  isLoading = false,
  disabled = false,
  error,
  ...props
}) => {
  const labelRef = useRef<HTMLLabelElement>(null);
  const isFilled = !!value;
  const isError = !!error;
  const isDisabled = isLoading || disabled;

  useEffect(() => {
    const { current } = labelRef;

    if (current && value) {
      const firstChild = current.children[0] as HTMLTextAreaElement;
      const scrollHeight = firstChild.scrollHeight;

      firstChild.style.height = scrollHeight + 'px';

      return () => {
        firstChild.style.height = 'inherit';
      };
    }
  }, [value]);

  return (
    <div className='flex flex-col'>
      <div
        className={twMerge('group relative cursor-text duration-200', isDisabled && 'opacity-50')}
      >
        <Typography
          className={twMerge(
            'absolute left-4 top-1/2 origin-left duration-150 group-focus-within:-translate-x-px group-focus-within:top-[9px] group-focus-within:scale-80',
            isFilled ? 'translate-x-[-1px] top-[9px] scale-80' : 'top-[18px] scale-100'
          )}
          color={isError ? 'danger' : 'secondary'}
        >
          {label}
        </Typography>
        <Typography
          className='pointer-events-none absolute right-4 top-[9px] origin-right scale-80 opacity-0 duration-150 group-focus-within:opacity-100'
          color='secondary'
        >
          {value.trim().length} / {maxLength}
        </Typography>
        <label
          className={twMerge(
            'flex w-full overflow-hidden rounded-xl border border-border-2 bg-input-background px-4 pb-[9px] pt-[27px] focus-within:border-primary focus-within:ring-1 focus-within:ring-inset focus-within:ring-primary',
            isError &&
              'bg-error-1/10 border-error-1 focus-within:ring-error-1 focus-within:border-error-1 caret-error-1'
          )}
          htmlFor={name}
          ref={labelRef}
        >
          <textarea
            className={twMerge(
              'max-h-[550px] w-full select-text resize-none whitespace-pre-wrap break-words bg-transparent text-left text-neutral outline-none [direction:ltr] placeholder:text-neutral-300',
              className
            )}
            rows={1}
            id={name}
            value={value}
            disabled={isDisabled}
            aria-label={label}
            maxLength={maxLength}
            onChange={(e) => onValueChange(e.target.value)}
            {...props}
          />
        </label>
      </div>
      {error && (
        <div className='flex gap-1 py-1.5 pl-1 pr-4'>
          <InfoOutlinedIcon className='mt-[0.5px] shrink-0 fill-error-1' />
          <Typography className='break-words' size='s' color='danger'>
            {error}
          </Typography>
        </div>
      )}
    </div>
  );
};
