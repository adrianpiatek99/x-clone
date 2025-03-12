import type { ComponentPropsWithoutRef, FC, ReactElement } from 'react';
import React, { createElement } from 'react';

import { Link } from '@/i18n/routing';
import { twMerge } from 'tailwind-merge';

import type {
  TypographyAs,
  TypographyClasses,
  TypographyColor,
  TypographySize,
  TypographyWeight,
} from './types';
import { TypographyText } from './TypographyText';

export type TypographyProps = ComponentPropsWithoutRef<'span'> & {
  href?: string;
  as?: TypographyAs;
  size?: TypographySize;
  weight?: TypographyWeight;
  color?: TypographyColor;
  center?: boolean;
  truncate?: boolean | { maxLength: number; textAfter?: string | ReactElement };
  linkProps?: ComponentPropsWithoutRef<'a'>;
};

export const typographyClasses: TypographyClasses = {
  size: {
    xs: 'text-xs',
    s: 'text-s',
    m: 'text-m',
    l: 'text-l',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
  },
  weight: {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  },
  color: {
    primary: "[color:theme('colors.text-1')]",
    secondary: "[color:theme('colors.text-2')]",
    danger: "[color:theme('colors.error-1')]",
    link: "[color:theme('colors.primary')]",
  },
};

export const Typography: FC<TypographyProps> = ({
  href,
  as = 'span',
  size = 'm',
  color = 'primary',
  weight = 'normal',
  center = false,
  truncate,
  linkProps,
  className = '',
  ...props
}) => {
  const baseClassName = twMerge(
    typographyClasses.size[size],
    typographyClasses.color[color],
    typographyClasses.weight[weight],
    className
  );

  const content = createElement(
    as,
    {
      className: twMerge(
        center ? '[text-align:center]' : '[text-align:left]',
        typeof truncate === 'boolean' && !!truncate && 'truncate',
        baseClassName
      ),
      ...props,
    },
    <TypographyText truncate={truncate} {...props} />
  );

  return href ? (
    <Link
      href={href}
      className={twMerge(
        '[&>*:nth-child(1)]:hover:underline [&>*:nth-child(1)]:focus-visible:underline',
        center ? '[text-align:center]' : '[text-align:left]',
        truncate && 'truncate',
        baseClassName
      )}
      {...linkProps}
    >
      {content}
    </Link>
  ) : (
    content
  );
};
