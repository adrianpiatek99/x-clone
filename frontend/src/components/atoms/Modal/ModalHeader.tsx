import type { FC } from 'react';
import React from 'react';

import { useTranslations } from 'next-intl';

import Button from '../Button';
import Icon from '../Icon';
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

  const handleClose = () => !isLoading && onClose();

  return (
    <div className='sticky left-0  top-0 z-10 flex h-[53px] shrink-0 flex-row items-center justify-between gap-x-4 gap-y-2 overflow-hidden bg-background/65 px-4 backdrop-blur-md'>
      <div className='flex'>
        <IconButton
          title={t('actions.close')}
          color='white'
          disabled={isLoading}
          onClick={handleClose}
        >
          <Icon name='CloseIcon' />
        </IconButton>
      </div>
      {typeof title === 'string' ? (
        <div className='flex flex-1 truncate'>
          <Typography as='h3' className='min-w-0' weight='bold' size='l' truncate>
            {title}
          </Typography>
        </div>
      ) : (
        title
      )}
      <div className='flex justify-end'>
        {!!onAccept && (
          <Button variant='tinted' onClick={onAccept} isLoading={isLoading} {...acceptButtonProps}>
            {acceptButtonText ?? t('actions.save')}
          </Button>
        )}
      </div>
      {isLoading && <LinearProgress />}
    </div>
  );
};
