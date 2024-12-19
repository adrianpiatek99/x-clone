import type { ComponentPropsWithRef, FC, ForwardedRef, HTMLProps, ReactElement } from 'react';
import React, { cloneElement, forwardRef } from 'react';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

import type { LoaderColor } from '../Loader';
import { Loader } from '../Loader';
import type {
  ButtonAlign,
  ButtonClassesReturn,
  ButtonColor,
  ButtonRounded,
  ButtonSize,
  ButtonVariant,
} from './Button.types';

export type ButtonProps = ComponentPropsWithRef<'button'> & {
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  fullWidth?: boolean;
  isLoading?: boolean;
  startIcon?: ReactElement<HTMLProps<HTMLElement>>;
  align?: ButtonAlign;
  linkClassName?: string;
  rounded?: ButtonRounded;
};

const classes: ButtonClassesReturn = {
  variant: {
    filled: {
      primary:
        'bg-primary [color:#fff] enabled:hover:bg-primary/75 enabled:active:bg-primary/60 focus-visible:ring-focus focus-visible:ring-2',
      danger:
        'bg-error-1 [color:#fff] focus-visible:ring-error-1 focus-visible:ring-2 enabled:hover:bg-error-1/75 enabled:active:bg-error-1/60',
    },
    tinted: {
      primary:
        'bg-primary/25 [color:theme("colors.primary")] focus-visible:ring-focus focus-visible:ring-2 enabled:hover:bg-primary/35 enabled:active:bg-primary/45',
      danger:
        'bg-error-1/25 [color:theme("colors.error-1")] focus-visible:ring-current focus-visible:ring-2 enabled:hover:bg-error-1/35 enabled:active:bg-error-1/45',
    },
    gray: {
      primary:
        'bg-button-background-gray/15 enabled:hover:bg-button-background-gray/22 enabled:active:bg-button-background-gray/30 [color:theme("colors.primary")] focus-visible:ring-focus focus-visible:ring-2',
      danger:
        'bg-button-background-gray/15 [color:theme("colors.error-1")] focus-visible:ring-current focus-visible:ring-2 enabled:hover:bg-button-background-gray/22 enabled:active:bg-button-background-gray/30',
    },
    plain: {
      primary:
        '[color:theme("colors.primary")] focus-visible:ring-focus focus-visible:ring-2 enabled:hover:opacity-75 enabled:active:opacity-60',
      danger:
        '[color:theme("colors.error-1")] focus-visible:ring-current focus-visible:ring-2 enabled:hover:opacity-75 enabled:active:opacity-60',
    },
  },
  size: {
    small: 'min-h-[28px] px-3.5 text-s',
    medium: 'min-h-[34px] px-4 text-m',
    large: 'min-h-[50px] rounded-[14px] px-6 text-m',
  },
  iconSize: {
    small: 'size-3.5',
    medium: 'size-4',
    large: 'size-4',
  },
  loaderSize: {
    small: 'text-[1.4px]',
    medium: 'text-[1.6px]',
    large: 'text-[1.6px]',
  },
  align: {
    left: 'justify-left',
    center: 'justify-center',
  },
  rounded: {
    full: 'rounded-full',
    large: 'rounded-[10px]',
  },
};

export const Button: FC<ButtonProps> = forwardRef(
  (
    {
      children,
      href,
      type = 'button',
      variant = 'filled',
      size = 'medium',
      color = 'primary',
      align = 'center',
      rounded = 'full',
      fullWidth = false,
      isLoading = false,
      disabled = false,
      startIcon,
      className = '',
      linkClassName = '',
      ...props
    },
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const t = useTranslations();
    const loaderColor = (
      variant === 'filled' ? 'white' : color === 'danger' ? 'danger' : 'primary'
    ) satisfies LoaderColor;

    const ButtonElement = () => (
      <button
        className={twMerge(
          'relative flex w-auto min-w-[36px] items-center gap-[5px] break-words px-4 font-medium normal-case duration-200 disabled:cursor-not-allowed disabled:opacity-50',
          classes.variant[variant][color],
          classes.rounded[rounded],
          classes.size[size],
          classes.align[align],
          fullWidth && 'w-full',
          className
        )}
        type={type}
        aria-label={isLoading ? t('loading') : undefined}
        disabled={isLoading || disabled}
        {...props}
        ref={ref}
      >
        {!isLoading && startIcon && cloneElement(startIcon, { className: classes.iconSize[size] })}
        {isLoading && <Loader className={classes.loaderSize[size]} color={loaderColor} />}
        <span>{children}</span>
      </button>
    );

    return href ? (
      <Link href={href} tabIndex={-1} className={twMerge('rounded-full', linkClassName)}>
        <ButtonElement />
      </Link>
    ) : (
      <ButtonElement />
    );
  }
);
