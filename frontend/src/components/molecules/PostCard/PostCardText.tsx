import React, { useState } from 'react';

import Typography from '@/components/atoms/Typography';
import type { Post } from '@/types/post';
import { useTranslations } from 'next-intl';

import { POST_TEXT_MAX_VISIBLE_LENGTH } from './config';

type Props = Pick<Post, 'text'> & {
  truncate?: boolean;
};

export const PostCardText = ({ text, truncate = true }: Props) => {
  const t = useTranslations();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpanded = () => truncate && setIsExpanded(!isExpanded);

  return (
    <div className='whitespace-pre-line'>
      <Typography
        truncate={
          truncate &&
          !isExpanded && {
            maxLength: POST_TEXT_MAX_VISIBLE_LENGTH,
            textAfter: (
              <Typography
                className='cursor-pointer hover:underline'
                onClick={handleToggleExpanded}
                color='link'
              >
                {t('actions.showMore')}
              </Typography>
            ),
          }
        }
      >
        {text}
      </Typography>
    </div>
  );
};
