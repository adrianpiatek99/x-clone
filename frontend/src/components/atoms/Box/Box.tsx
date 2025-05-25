import type { ComponentPropsWithRef, FC, Ref } from 'react';
import { createElement } from 'react';

import { twMerge } from 'tailwind-merge';

import type { BoxAs } from './types';

export type BoxProps = ComponentPropsWithRef<'div'> & {
  as?: BoxAs;
  ref?: Ref<HTMLDivElement | null>;
};

const Box: FC<BoxProps> = ({ as = 'div', className, ...props }) =>
  createElement(as, {
    className: twMerge('flex flex-col gap-3 min-w-0', className),
    ...props,
  });

export default Box;
