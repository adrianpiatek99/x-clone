import React from 'react';

import type { TypographyProps } from '@/components/atoms/Typography';
import { Typography } from '@/components/atoms/Typography';
import { VerifiedIcon } from '@/icons';

type Props = Pick<TypographyProps, 'href' | 'onClick' | 'className' | 'size'> & {
  name: string;
  isVerified?: boolean;
};

const UserDisplayName = ({ name, isVerified, size, className, ...props }: Props) => {
  return (
    <Typography className='inline-flex items-center truncate' {...props}>
      <Typography className={className} weight='bold' truncate size={size}>
        {name}
      </Typography>
      {isVerified && <VerifiedIcon className='ml-1 size-[19px] shrink-0 text-primary' />}
    </Typography>
  );
};

export default UserDisplayName;
