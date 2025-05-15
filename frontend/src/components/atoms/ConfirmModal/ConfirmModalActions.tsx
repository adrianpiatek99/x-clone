import type { FC } from 'react';
import React from 'react';

import { useTranslations } from 'next-intl';

import Box from '../Box';
import Button from '../Button';
import type { ConfirmModalProps } from './ConfirmModal';

type Props = Pick<
  ConfirmModalProps,
  'isLoading' | 'onClose' | 'onAccept' | 'cancelButtonText' | 'acceptButtonText' | 'danger'
>;

export const ConfirmModalActions: FC<Props> = ({
  isLoading,
  onAccept,
  onClose,
  acceptButtonText,
  cancelButtonText,
  danger,
}) => {
  const t = useTranslations();

  return (
    <Box className='ml-auto mt-4 flex-row flex-wrap'>
      <Button className='grow' onClick={onClose} variant='gray' disabled={isLoading}>
        {cancelButtonText || t('actions.cancel')}
      </Button>
      <Button
        className='grow'
        onClick={onAccept}
        variant='tinted'
        color={danger ? 'danger' : 'primary'}
        isLoading={isLoading}
      >
        {acceptButtonText || t('actions.save')}
      </Button>
    </Box>
  );
};
