import React from 'react';

import Icon from '@/components/atoms/Icon';
import type { TypographyProps } from '@/components/atoms/Typography';
import { Typography } from '@/components/atoms/Typography';
import { twMerge } from 'tailwind-merge';

type Props = Pick<TypographyProps, 'href' | 'onClick' | 'className' | 'size'> & {
  name: string;
  isVerified?: boolean;
  verifiedClassName?: string;
};

const UserDisplayName = ({
  name,
  isVerified,
  size,
  className,
  verifiedClassName,
  ...props
}: Props) => {
  return (
    <Typography className='inline-flex items-center truncate' {...props}>
      <Typography className={className} weight='semibold' truncate size={size}>
        {name}
      </Typography>
      {isVerified && (
        <Icon
          name='VerifiedIcon'
          className={twMerge('ml-1 size-[14px] shrink-0 text-primary', verifiedClassName)}
        />
      )}
    </Typography>
  );
};

export default UserDisplayName;
