import type { FC } from 'react';
import React from 'react';

import { useTranslations } from 'next-intl';

import { Box } from '../Box';
import { Button } from '../Button';
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
    <Box className='gap-0'>
      <Button
        className='min-h-[38px] rounded-none border-t border-dropdown-border bg-transparent focus-visible:ring-inset  enabled:hover:bg-text-1/10 enabled:active:bg-text-1/15'
        onClick={onAccept}
        variant='gray'
        color={danger ? 'danger' : 'primary'}
        isLoading={isLoading}
        fullWidth
      >
        {acceptButtonText || t('actions.save')}
      </Button>
      <Button
        className='min-h-[38px] rounded-none rounded-b-2xl border-t border-dropdown-border bg-transparent focus-visible:ring-inset  enabled:hover:bg-text-1/10 enabled:active:bg-text-1/15'
        onClick={onClose}
        variant='gray'
        disabled={isLoading}
        fullWidth
      >
        {cancelButtonText || t('actions.cancel')}
      </Button>
    </Box>
  );
};
