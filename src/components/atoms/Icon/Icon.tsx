import type { ComponentProps } from 'react';
import React from 'react';

import * as Icons from '@/icons';
import { twMerge } from 'tailwind-merge';

type IconName = keyof typeof Icons;

type Props = ComponentProps<'svg'> & {
  name: IconName;
};

const Icon = ({ name, className, ...props }: Props) => {
  const IconComponent = Icons[name];

  if (!IconComponent) return null;

  return <IconComponent className={twMerge('text-current size-[24px]', className)} {...props} />;
};

export default Icon;
