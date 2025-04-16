import type { ReactNode } from 'react';
import React from 'react';

import Box from '@/components/atoms/Box';
import IconButton from '@/components/atoms/IconButton';
import Typography from '@/components/atoms/Typography';
import { useRouter } from '@/i18n/routing';
import { ArrowBackIcon } from '@/icons';
import { useTranslations } from 'next-intl';

export type HeaderBarProps = {
  children: ReactNode;
  showBackButton?: boolean;
  additionalContent?: ReactNode;
} & ({ title: string; subtitle?: string } | { title?: undefined; subtitle?: undefined });

const HeaderBar = ({
  children,
  showBackButton = false,
  title,
  subtitle,
  additionalContent,
}: HeaderBarProps) => {
  const router = useRouter();
  const t = useTranslations();

  return (
    <div className='sticky top-0 z-10 flex min-h-[53px] w-full flex-col bg-background/65 backdrop-blur-md transition duration-200'>
      {(showBackButton || title) && (
        <div className='flex h-[53px] w-full shrink-0 items-center gap-x-4 gap-y-2 px-4'>
          {showBackButton && (
            <IconButton color='white' title={t('actions.back')} onClick={router.back}>
              <ArrowBackIcon />
            </IconButton>
          )}
          {title && (
            <Box className='gap-0.5'>
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
    </div>
  );
};

export default HeaderBar;
