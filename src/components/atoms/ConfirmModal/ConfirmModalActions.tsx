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
    <Box className='flex-row gap-0'>
      <Button
        className='min-h-[38px] rounded-none rounded-bl-2xl border-r border-t border-border-3 bg-transparent focus-visible:ring-inset enabled:hover:bg-text-1/10 enabled:active:bg-text-1/15'
        onClick={onClose}
        variant='gray'
        disabled={isLoading}
        fullWidth
      >
        {cancelButtonText || t('actions.cancel')}
      </Button>
      <Button
        className='min-h-[38px] rounded-none rounded-br-2xl border-t border-border-3 bg-transparent focus-visible:ring-inset enabled:hover:bg-text-1/10 enabled:active:bg-text-1/15'
        onClick={onAccept}
        variant='gray'
        color={danger ? 'danger' : 'primary'}
        isLoading={isLoading}
        fullWidth
      >
        {acceptButtonText || t('actions.save')}
      </Button>
    </Box>
  );
};
