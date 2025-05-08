import React from 'react';

import Typography from '@/components/atoms/Typography';
import { ROUTES } from '@/constants/routes';
import { Link } from '@/i18n/routing';
import type { Post } from '@/types/post';
import { useTranslations } from 'next-intl';

import { POST_TEXT_MAX_VISIBLE_LENGTH } from './config';

type Props = Pick<Post, 'text' | 'author' | 'id'> & {
  truncate?: boolean;
};

export const PostCardText = ({ text, author: { screenName }, id, truncate = true }: Props) => {
  const t = useTranslations();

  return (
    <div className='whitespace-pre-line'>
      <Typography
        truncate={
          truncate && {
            maxLength: POST_TEXT_MAX_VISIBLE_LENGTH,
            textAfter: (
              <Link className='link' href={ROUTES.POST.DETAILS(screenName, id)}>
                {t('actions.showMore')}
              </Link>
            ),
          }
        }
      >
        {text}
      </Typography>
    </div>
  );
};
