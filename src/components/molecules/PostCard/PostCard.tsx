import type { ComponentPropsWithRef, RefCallback } from 'react';
import React, { memo } from 'react';

import Avatar from '@/components/atoms/Avatar';
import Box from '@/components/atoms/Box';
import Typography from '@/components/atoms/Typography';
import { ROUTES } from '@/constants/routes';
import type { Post } from '@/db/schema';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

export const POST_TEXT_MAX_VISIBLE_LENGTH = 280;

type Props = ComponentPropsWithRef<'div'> & {
  data: Post;
  ref?: RefCallback<HTMLDivElement>;
};

const PostCard = memo(({ data, className, ...props }: Props) => {
  const t = useTranslations();
  const {
    id,
    text,
    author: { profileImageUrl, screenName },
  } = data;

  return (
    <Box
      as='article'
      className={twMerge(
        'cursor-pointer border-b border-border-1 px-4 py-3 outline-none transition duration-200 focus-visible:bg-[rgba(255,255,255,0.1)] focus-visible:shadow-focus',
        className
      )}
      {...props}
      tabIndex={0}
    >
      <Box className='relative flex-row items-start'>
        <Avatar
          href={ROUTES.PROFILE.DETAILS(screenName)}
          src={profileImageUrl}
          screenName={screenName}
        />
        <Box className='gap-1'>
          <Box className='mt-0.5'>
            <div className='hide-scrollbar inline-block max-h-[550px] w-[98%] overflow-y-auto whitespace-pre-line'>
              <Typography
                truncate={{
                  maxLength: POST_TEXT_MAX_VISIBLE_LENGTH,
                  textAfter: (
                    <Link className='link' href={ROUTES.POST.DETAILS(screenName, id)}>
                      {t('actions.showMore')}
                    </Link>
                  ),
                }}
              >
                {text}
              </Typography>
            </div>
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

export default PostCard;
