import type { ReactElement } from 'react';
import React, { cloneElement } from 'react';

import type { ToastType } from '@/hooks/useToasts';
import { useToasts } from '@/hooks/useToasts';
import { twMerge } from 'tailwind-merge';

import Icon from '../Icon';
import type { CustomToastClasses } from './types';

const icons = {
  success: <Icon name='CheckCircleIcon' />,
  information: <Icon name='InfoOutlinedIcon' />,
  warning: <Icon name='WarningIcon' />,
  error: <Icon name='RaportIcon' />,
} satisfies Record<ToastType, ReactElement>;

export type CustomToastProps = { id: string; type: ToastType; visible: boolean; message: string };

const classes: CustomToastClasses = {
  variant: {
    success: 'bg-primary/40 border border-primary',
    information: 'bg-info/40 border border-info',
    warning: 'bg-warning/40 border border-warning',
    error: 'bg-error-1/40 border border-error-1',
  },
  icon: {
    success: 'text-primary fill-primary',
    information: 'text-info fill-info',
    warning: 'text-warning fill-warning',
    error: 'text-error-1 fill-error-1',
  },
};

const CustomToast = ({ id, type, visible, message }: CustomToastProps) => {
  const { removeToast } = useToasts();
  const icon = icons[type] || null;

  return (
    <div
      className={twMerge(
        'flex items-center gap-3 rounded-xl backdrop-blur-md p-3 shadow [pointer-events:all] cursor-pointer w-full max-w-md duration-200',
        visible ? 'animate-enter' : 'animate-leave',
        classes.variant[type]
      )}
      onClick={() => removeToast(id)}
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

export default CustomToast;
