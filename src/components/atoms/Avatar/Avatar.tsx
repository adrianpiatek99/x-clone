import type { FC } from 'react';
import React, { memo } from 'react';

import { DEFAULT_AVATAR_URL } from '@/constants/urls';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

import { Skeleton } from '../Skeleton';
import type { AvatarClasses, AvatarSize } from './Avatar.types';

export type AvatarProps = {
  src: string;
  size?: AvatarSize;
  screenName?: string;
  href?: string;
  onClick?: () => void;
  isLoading?: boolean;
  className?: string;
};

const classes: AvatarClasses = {
  size: {
    small: 'size-[32px]',
    medium: 'size-[40px]',
    large: 'size-[48px]',
    extraLarge: 'size-[68px]',
    profile: 'size-[133px]',
  },
};

export const Avatar: FC<AvatarProps> = memo(
  ({ src, size = 'medium', screenName, href, onClick, isLoading = false, className = '' }) => {
    const t = useTranslations();
    const alt = screenName || t('profileImage');

    const AvatarElement = () => (
      <div
        className={twMerge(
          "relative flex shrink-0 items-center justify-center rounded-full bg-foreground duration-200 after:pointer-events-none after:absolute after:inset-0 after:bg-black/25 after:opacity-0 after:duration-200 after:content-[''] after:[border-radius:inherit] after:group-hover:opacity-100 after:group-focus-visible:opacity-100 after:group-focus-visible:ring-focus after:group-focus-visible:ring-2 after:group-active:bg-black/35",
          classes.size[size],
          className
        )}
      >
        {isLoading ? (
          <Skeleton absolute variant='circular' />
        ) : (
          <Image
            className='object-cover [border-radius:inherit]'
            src={src || DEFAULT_AVATAR_URL}
            alt={alt}
            fill
          />
        )}
      </div>
    );

    if (href) {
      return (
        <Link className='group w-fit rounded-full outline-none' href={href}>
          <AvatarElement />
        </Link>
      );
    }

    if (onClick) {
      return (
        <button className='group w-fit rounded-full' type='button' onClick={onClick} title={alt}>
          <AvatarElement />
        </button>
      );
    }

    return <AvatarElement />;
  }
);
