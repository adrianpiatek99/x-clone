import type { ComponentPropsWithRef, ForwardedRef } from 'react';
import React, { forwardRef } from 'react';

import { Link } from '@/i18n/routing';
import { twMerge } from 'tailwind-merge';

import { Tooltip } from '../Tooltip';
import type { IconButtonClassesReturn, IconButtonColor, IconButtonSize } from './IconButton.types';

export type IconButtonProps = ComponentPropsWithRef<'button'> & {
  title?: string;
  label?: string;
  size?: IconButtonSize;
  color?: IconButtonColor;
  disableFocus?: boolean;
  href?: string;
  linkClassName?: string;
  isActive?: boolean;
};

const classes: IconButtonClassesReturn = {
  color: {
    primary:
      'text-primary bg-primary/0 enabled:hover:bg-primary/15 enabled:active:bg-primary/25 focus-visible:bg-primary/15 focus-visible:ring-focus focus-visible:ring-2',
    secondary:
      'text-text-2 bg-primary/0 enabled:hover:bg-primary/10 enabled:active:bg-primary/20 focus-visible:bg-primary/10 enabled:hover:text-primary enabled:active:text-primary focus-visible:ring-focus focus-visible:ring-2 focus-visible:text-primary',
    danger:
      'text-error-1 bg-error-1/0 enabled:hover:bg-error-1/10 enabled:active:bg-error-1/20 focus-visible:bg-error-1/10',
    white:
      'text-text-1 bg-button-gray-background/0 enabled:hover:bg-button-gray-background/22 enabled:active:bg-button-gray-background/30 focus-visible:bg-button-gray-background/10',
    darker:
      'text-white bg-[rgb(51,59,45)] enabled:hover:bg-[rgb(51,59,45)]/80 enabled:active:bg-[rgb(51,59,45)]/60',
  },
  size: {
    small: 'min-w-[34px] min-h-[34px] [&>svg]:size-[16px]',
    medium: 'min-w-[34px] min-h-[34px] [&>svg]:size-[20px]',
    large: 'min-w-[42px] min-h-[42px] [&>svg]:size-[24px]',
  },
};

export const IconButton = forwardRef(
  (
    {
      children,
      href,
      title = '',
      label,
      size = 'medium',
      color = 'primary',
      disableFocus = false,
      className = '',
      linkClassName = '',
      isActive = false,
      ...props
    }: IconButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const isCustomColor = className.includes('bg-') && className.includes('text-');
    const tabIndex = disableFocus ? -1 : 0;
    const tooltipId = title.replaceAll(' ', '-');

    const IconButtonElement = () => (
      <button
        data-label={label}
        data-tooltip-id={title ? tooltipId : undefined}
        className={twMerge(
          'relative flex w-max shrink-0 items-center justify-center rounded-full p-0 duration-200 focus-visible:ring-2 focus-visible:ring-current disabled:cursor-not-allowed disabled:opacity-50 [&>svg]:shrink-0',
          label && 'after:content-[attr(data-label)] after:px-3 pl-3',
          isCustomColor
            ? 'bg-opacity-0 focus-visible:bg-opacity-10 enabled:hover:bg-opacity-10 enabled:active:bg-opacity-20'
            : classes.color[color],
          classes.size[size],
          isActive && 'opacity-50',
          className
        )}
        aria-label={title}
        type='button'
        tabIndex={tabIndex}
        {...props}
        ref={ref}
      >
        {children}
        {title && <Tooltip tooltipId={tooltipId} content={title} />}
      </button>
    );

    return href ? (
      <Link href={href} tabIndex={-1} className={twMerge('rounded-full', linkClassName)}>
        <IconButtonElement />
      </Link>
    ) : (
      <IconButtonElement />
    );
  }
);
