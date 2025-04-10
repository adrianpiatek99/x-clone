import type { FC } from 'react';
import React from 'react';

import { CloseIcon } from '@/icons';
import { useTranslations } from 'next-intl';

import Button from '../Button';
import IconButton from '../IconButton';
import LinearProgress from '../LinearProgress';
import { Typography } from '../Typography';
import type { ModalProps } from './Modal';

type ModalHeaderProps = Pick<
  ModalProps,
  'onClose' | 'title' | 'onAccept' | 'isLoading' | 'acceptButtonText' | 'acceptButtonProps'
>;

export const ModalHeader: FC<ModalHeaderProps> = ({
  onClose,
  isLoading,
  onAccept,
  title,
  acceptButtonText,
  acceptButtonProps,
}) => {
  const t = useTranslations();

  return (
    <div className='relative flex h-[53px] shrink-0 flex-row items-center justify-between gap-3 overflow-hidden px-4'>
      <div className='flex flex-1 grow'>
        <IconButton title={t('actions.close')} color='white' onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>
      {typeof title === 'string' ? (
        <div className='flex flex-1 grow-[3] justify-center truncate'>
          <Typography className='min-w-0' truncate as='h2' weight='bold' size='xl'>
            {title}
          </Typography>
        </div>
      ) : (
        title
      )}
      <div className='flex flex-1 grow justify-end'>
        {!!onAccept && (
          <Button variant='plain' onClick={onAccept} isLoading={isLoading} {...acceptButtonProps}>
            {acceptButtonText ?? t('actions.save')}
          </Button>
        )}
      </div>
      {isLoading && <LinearProgress />}
    </div>
  );
};
