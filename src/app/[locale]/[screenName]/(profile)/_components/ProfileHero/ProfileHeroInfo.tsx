import React from 'react';

import Box from '@/components/atoms/Box';
import Icon from '@/components/atoms/Icon';
import Skeleton from '@/components/atoms/Skeleton';
import Typography from '@/components/atoms/Typography';
import UserDisplayName from '@/components/molecules/UserDisplayName';
import { ROUTES } from '@/constants/routes';
import { useGetUserByScreenNameQuery } from '@/hooks/api/profile/useGetUserByScreenNameQuery';
import { useTime } from '@/hooks/useTime';
import { formatNumber } from '@/utils/formatNumber';
import { removeHttp } from '@/utils/url';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export const ProfileHeroInfo = () => {
  const t = useTranslations();
  const { screenName } = useParams();
  const [animationParent] = useAutoAnimate({ duration: 100 });
  const { getFullDate } = useTime();
  const { data, isLoading } = useGetUserByScreenNameQuery({
    screenName: screenName as string,
    enabled: false,
  });

  return (
    <Box ref={animationParent}>
      {isLoading ? (
        <>
          <Box className='gap-1'>
            <Skeleton width={140} height={22} />
            <Skeleton width={125} height={20} />
          </Box>
          <Box className='gap-1'>
            <Skeleton height={15} />
            <Skeleton width={275} height={15} />
          </Box>
          <Box className='flex flex-row flex-wrap gap-x-3 gap-y-1'>
            <Skeleton width={125} height={15} />
            <Skeleton width={100} height={15} />
            <Skeleton width={100} height={15} />
            <Skeleton width={100} height={15} />
            <Skeleton width={100} height={15} />
          </Box>
          <Box className='flex-row flex-wrap'>
            <Skeleton height={14} width={80} />
            <Skeleton height={14} width={80} />
          </Box>
        </>
      ) : (
        data && (
          <>
            <Box className='gap-1'>
              <UserDisplayName
                name={data.name}
                isVerified={data.isVerified}
                size='xl'
                verifiedClassName='size-[18px]'
              />
              <Typography color='secondary'>@{data.screenName}</Typography>
            </Box>
            {data.description && (
              <Box className='gap-1'>
                <Typography>{data.description}</Typography>
              </Box>
            )}
            <div className='ml-[-3px]'>
              <div className='inline min-w-0 whitespace-pre-wrap break-words [&>a>span>svg]:[color:theme("colors.text-2")] [&>a>span]:mr-3 [&>a>span]:inline-flex [&>a>span]:items-center [&>a>span]:break-words [&>a>span]:align-middle [&>a>span]:leading-[18px] [&>a]:text-primary [&>a]:hover:underline [&>div]:mr-3 [&>div]:inline-flex [&>div]:items-center [&>div]:break-words [&>div]:align-middle [&>div]:leading-[18px] [&>div]:[color:inherit] [&>span]:mr-3 [&>span]:inline-flex [&>span]:items-center [&>span]:break-words [&>span]:align-middle [&>span]:leading-[18px]'>
                {data.url && (
                  <Typography
                    href={data.url}
                    color='link'
                    linkProps={{
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    }}
                  >
                    <Icon name='LinkIcon' className='mr-1 size-[18px] shrink-0' />
                    {removeHttp(data.url)}
                  </Typography>
                )}
                <Typography color='secondary'>
                  <Icon name='CalendarIcon' className='mr-1 size-[18px] shrink-0' />
                  {t('profilePage.joined')} {getFullDate(data.createdAt)}
                </Typography>
              </div>
            </div>
            <Box className='flex-row flex-wrap gap-4'>
              <Typography href={ROUTES.PROFILE.FOLLOWING(data.screenName)}>
                <Typography weight='bold'>{formatNumber(data.followingCount)} </Typography>
                <Typography color='secondary'>{t('profilePage.following')}</Typography>
              </Typography>
              <Typography href={ROUTES.PROFILE.FOLLOWERS(data.screenName)}>
                <Typography weight='bold'>{formatNumber(data.followersCount)} </Typography>
                <Typography color='secondary'>{t('profilePage.followers')}</Typography>
              </Typography>
            </Box>
          </>
        )
      )}
    </Box>
  );
};
