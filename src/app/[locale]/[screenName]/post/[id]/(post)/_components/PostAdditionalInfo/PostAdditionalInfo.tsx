import React from 'react';

import Box from '@/components/atoms/Box';
import Typography from '@/components/atoms/Typography';
import { MID_DOT } from '@/constants/strings';
import type { Post } from '@/db/schema';
import { useTime } from '@/hooks/useTime';

type Props = Pick<Post, 'createdAt'>;

const PostAdditionalInfo = ({ createdAt }: Props) => {
  const { getLocalTime, getFullDate } = useTime();

  return (
    <Box className='flex-row'>
      <Typography className='whitespace-nowrap' color='secondary'>
        {getLocalTime(createdAt)} {MID_DOT} {getFullDate(createdAt)}
      </Typography>
    </Box>
  );
};

export default PostAdditionalInfo;
