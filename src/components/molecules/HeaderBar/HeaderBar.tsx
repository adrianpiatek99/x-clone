import type { ReactNode } from 'react';
import React from 'react';

import Box from '@/components/atoms/Box';
import IconButton from '@/components/atoms/IconButton';
import Typography from '@/components/atoms/Typography';
import { useIsMobile } from '@/hooks/useIsMobile';
import { ScrollDirection } from '@/hooks/useScrollDirection';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useRouter } from '@/i18n/routing';
import { ArrowBackIcon } from '@/icons';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

import { PillNotifyRefreshing } from '../PillNotify/PillNotifyRefreshing';

export type HeaderBarProps = {
  children?: ReactNode;
  showBackButton?: boolean;
  additionalContent?: ReactNode;
  isRefetching?: boolean;
} & ({ title: string; subtitle?: string } | { title?: undefined; subtitle?: undefined });

const HeaderBar = ({
  children,
  showBackButton = false,
  title,
  subtitle,
  additionalContent,
  isRefetching = false,
}: HeaderBarProps) => {
  const t = useTranslations();
  const router = useRouter();
  const scrollDirection = useScrollDirection();
  const isScrollDirectionDown = scrollDirection === ScrollDirection.DOWN;
  const isMobile = useIsMobile();

  const handleBack = () => router.back();

  return (
    <div
      className={twMerge(
        'sticky top-0 z-10 flex min-h-[53px] w-full flex-col bg-background/65 backdrop-blur-md transition duration-200',
        isScrollDirectionDown && isMobile && 'opacity-30 -translate-y-full'
      )}
    >
      {(showBackButton || title) && (
        <div className='flex h-[53px] w-full shrink-0 items-center gap-x-4 gap-y-2 px-4'>
          {showBackButton && (
            <IconButton
              className='-ml-2'
              color='white'
              title={t('actions.back')}
              onClick={handleBack}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          {title && (
            <Box className='gap-0'>
              <Typography as='h2' size='l' weight='semibold' truncate>
                {title}
              </Typography>
              {subtitle && (
                <Typography color='secondary' size='xs' truncate>
                  {subtitle}
                </Typography>
              )}
            </Box>
          )}
          {additionalContent}
        </div>
      )}
      {children}
      <div className='absolute right-1/2 top-full -translate-y-1/2'>
        <PillNotifyRefreshing isRefetching={isRefetching} />
      </div>
    </div>
  );
};

export default HeaderBar;
