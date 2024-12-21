import type { ComponentPropsWithoutRef } from 'react';
import React, { useRef } from 'react';

import { CloseCircleIcon, SearchOutlinedIcon } from '@/icons';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

import { IconButton } from '../IconButton';

const DEFAULT_MAX_LENGTH = 255;

export type SearchBarProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'type' | 'name' | 'size' | 'onChange'
> & {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  fullWidth?: boolean;
};

export const SearchBar = ({
  value,
  onChange,
  placeholder,
  disabled = false,
  fullWidth = false,
  ...props
}: SearchBarProps) => {
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);
  const allowClear = !disabled && value.length >= 1;

  const handleFocus = () => inputRef?.current && inputRef.current.focus();

  const handleClearValue = () => {
    if (!inputRef?.current) return;

    onChange('');
    inputRef.current.value = '';
    handleFocus();
  };

  return (
    <div
      className={twMerge(
        'relative h-[44px] w-fit duration-200',
        fullWidth && 'w-full',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <input
        className='size-full break-words rounded-full border border-border-2 bg-foreground pl-[36px] pr-[42px] text-text-1 outline-none duration-200 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary focus-visible:[background-color:transparent] disabled:cursor-not-allowed'
        type='text'
        placeholder={placeholder ?? t('search')}
        role='searchbox'
        value={value}
        onChange={({ target }) => onChange(target.value)}
        disabled={disabled}
        maxLength={DEFAULT_MAX_LENGTH}
        ref={inputRef}
        {...props}
      />
      <div
        className={twMerge(
          'absolute left-3 top-1/2 -translate-y-1/2 cursor-text text-text-2',
          disabled && 'cursor-not-allowed'
        )}
        onClick={handleFocus}
      >
        <SearchOutlinedIcon className='size-[20px]' />
      </div>
      {allowClear && (
        <IconButton
          className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full duration-200'
          title={t('actions.clear')}
          onClick={handleClearValue}
          color='secondary'
          disableFocus
        >
          <CloseCircleIcon />
        </IconButton>
      )}
    </div>
  );
};
