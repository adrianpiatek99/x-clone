import type { ComponentPropsWithRef, FC, RefCallback } from 'react';
import React from 'react';

import { Link } from '@/i18n/routing';
import { twMerge } from 'tailwind-merge';

import { Tooltip } from '../Tooltip';
import type { IconButtonClassesReturn, IconButtonColor, IconButtonSize } from './types';

export type IconButtonProps = ComponentPropsWithRef<'button'> & {
  title?: string;
  label?: string;
  size?: IconButtonSize;
  color?: IconButtonColor;
  disableFocus?: boolean;
  href?: string;
  linkClassName?: string;
  isActive?: boolean;
  ref?: RefCallback<HTMLButtonElement>;
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
      'text-text-1 bg-button-background-gray/0 enabled:hover:bg-button-background-gray/22 enabled:active:bg-button-background-gray/30 focus-visible:bg-button-background-gray/10',
    darker:
      'text-white bg-[rgb(51,59,45)] enabled:hover:bg-[rgb(51,59,45)]/80 enabled:active:bg-[rgb(51,59,45)]/60',
  },
  size: {
    small: 'min-w-[34px] min-h-[34px] [&>svg]:size-[16px]',
    medium: 'min-w-[34px] min-h-[34px] [&>svg]:size-[20px]',
    large: 'min-w-[42px] min-h-[42px] [&>svg]:size-[24px]',
  },
};

const IconButtonElement: FC<IconButtonProps> = ({
  children,
  title = '',
  size = 'medium',
  color = 'primary',
  disableFocus = false,
  label,
  isActive = false,
  className = '',
  ...props
}) => {
  const isCustomColor = className.includes('bg-') && className.includes('text-');
  const tooltipId = title.replaceAll(' ', '-');
  const tabIndex = disableFocus ? -1 : 0;

  return (
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
    >
      {children}
      {title && <Tooltip tooltipId={tooltipId} content={title} />}
    </button>
  );
};

export const IconButton: FC<IconButtonProps> = ({ href, linkClassName = '', ...props }) => {
  return href ? (
    <Link href={href} tabIndex={-1} className={twMerge('rounded-full', linkClassName)}>
      <IconButtonElement {...props} />
    </Link>
  ) : (
    <IconButtonElement {...props} />
  );
};
