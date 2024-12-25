import type { ReactElement } from 'react';
import React, { cloneElement } from 'react';

import type { ToastType } from '@/hooks/useToasts';
import { useToasts } from '@/hooks/useToasts';
import { CheckCircleIcon, InfoOutlinedIcon, RaportIcon, WarningIcon } from '@/icons';
import { twMerge } from 'tailwind-merge';

import type { CustomToastClasses } from './types';

const icons = {
  success: <CheckCircleIcon />,
  information: <InfoOutlinedIcon />,
  warning: <WarningIcon />,
  error: <RaportIcon />,
} satisfies Record<ToastType, ReactElement>;

export type CustomToastProps = { id: string; type: ToastType; visible: boolean; message: string };

const classes: CustomToastClasses = {
  icon: {
    success: 'text-primary fill-primary',
    information: 'text-info fill-info',
    warning: 'text-warning fill-warning',
    error: 'text-error-1 fill-error-1',
  },
};

export const CustomToast = ({ id, type, visible, message }: CustomToastProps) => {
  const { handleRemoveToast } = useToasts();
  const icon = icons[type] || null;

  return (
    <div
      className={twMerge(
        'flex items-center gap-3 rounded-xl bg-accent-1/80 backdrop-blur-md p-3 shadow [pointer-events:all] cursor-pointer w-full max-w-md duration-200',
        visible ? 'animate-enter' : 'animate-leave'
      )}
      onClick={() => handleRemoveToast(id)}
    >
      {icon &&
        cloneElement(icon, {
          className: twMerge('shrink-0 size-6 mt-0.5', classes.icon[type]),
        })}
      <div className='flex grow select-none'>
        <span>{message}</span>
      </div>
    </div>
  );
};
