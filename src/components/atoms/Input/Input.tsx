import type { ComponentPropsWithRef, ForwardedRef } from 'react';
import React, { forwardRef, useCallback, useMemo, useRef, useState } from 'react';

import { InfoOutlinedIcon } from '@/icons';
import { twMerge } from 'tailwind-merge';

import { Typography } from '../Typography';
import type { InputType } from './Input.types';
import { InputIcons } from './InputIcons';

const DEFAULT_MAX_LENGTH = 255;

export type InputProps = Omit<ComponentPropsWithRef<'input'>, 'type' | 'size' | 'onChange'> & {
  label: string;
  name: string;
  onChange?: (value: string) => void;
  type?: InputType;
  isLoading?: boolean;
  disabled?: boolean;
  error?: string;
};

export const Input = forwardRef(
  (
    {
      label,
      name,
      value = '',
      onChange,
      isLoading = false,
      disabled = false,
      type = 'text',
      error,
      maxLength = DEFAULT_MAX_LENGTH,
      ...props
    }: InputProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputType = isPasswordVisible ? 'text' : type;
    const isPasswordIcon = type === 'password';
    const isFilled = !!value;
    const isError = !!error;
    const isDisabled = isLoading || disabled;

    const iconsCount = useMemo(() => {
      let count = 0;

      if (isPasswordIcon) count++;

      if (isFilled) count++;

      return count;
    }, [isPasswordIcon, isFilled]);

    const handleTogglePasswordVisible = useCallback(() => {
      wrapperRef.current?.click();
      setIsPasswordVisible((prev) => !prev);
    }, []);

    const handleClearValue = useCallback(() => {
      const inputEl = (wrapperRef?.current as HTMLElement).getElementsByTagName('input')[0];

      if (!inputEl) return;

      onChange?.('');

      inputEl.value = '';
      inputEl.focus();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div className='flex flex-col'>
        <div
          ref={wrapperRef}
          className={twMerge('group relative cursor-text duration-200', isDisabled && 'opacity-50')}
        >
          <label
            htmlFor={name}
            className={twMerge(
              'pointer-events-none absolute inset-0 overflow-hidden pl-2 duration-150 [border-radius:inherit]'
            )}
          >
            <Typography
              className={twMerge(
                'absolute left-4 top-1/2 origin-left duration-150 group-focus-within:-translate-x-px group-focus-within:translate-y-[-110%] group-focus-within:scale-80',
                isFilled
                  ? 'translate-x-[-1px] translate-y-[-110%] scale-80'
                  : '-translate-y-1/2 scale-100'
              )}
              color={isError ? 'danger' : 'secondary'}
            >
              {label}
            </Typography>
          </label>
          <input
            style={{ paddingRight: iconsCount ? `calc(46px * ${iconsCount})` : '' }}
            className={twMerge(
              'group mx-0 h-[56px] w-full break-words rounded-xl border border-border-2 bg-input-background px-4 pt-[18px] text-text-1 outline-none duration-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-inset focus-within:ring-primary focus-within:[background-color:transparent] disabled:cursor-not-allowed',
              isError &&
                'bg-error-1/10 border-error-1 focus-within:ring-error-1 focus-within:border-error-1 caret-error-1'
            )}
            value={value}
            onChange={({ target }) => onChange?.(target.value)}
            id={name}
            name={name}
            type={inputType}
            aria-label={label}
            autoComplete='off'
            disabled={isDisabled}
            maxLength={maxLength}
            {...props}
            ref={ref}
          />
          <InputIcons
            isPasswordVisible={isPasswordVisible}
            isPasswordIcon={isPasswordIcon}
            isDisabled={isDisabled}
            isFilled={isFilled}
            isError={isError}
            handleTogglePasswordVisible={handleTogglePasswordVisible}
            handleClearValue={handleClearValue}
          />
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
  }
);
