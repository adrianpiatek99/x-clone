import type { ReactNode } from 'react';
import React, { Suspense } from 'react';

import Box from '@/components/atoms/Box';
import Typography from '@/components/atoms/Typography';

import { LazyPillNotifyRefreshing } from '../PillNotify';
import { HeaderBarBackButton } from './HeaderBarBackButton';

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
  return (
    <div
      id='header-bar'
      className='sticky top-0 z-10 flex min-h-[53px] w-full flex-col bg-background/65 backdrop-blur-md transition duration-200'
    >
      {(showBackButton || title) && (
        <div className='flex h-[53px] w-full shrink-0 items-center gap-x-4 gap-y-2 px-4'>
          {showBackButton && <HeaderBarBackButton />}
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
      <Suspense>
        <div className='absolute left-1/2 top-full -translate-y-1/2'>
          <LazyPillNotifyRefreshing isRefetching={isRefetching} />
        </div>
      </Suspense>
    </div>
  );
};

export default HeaderBar;
