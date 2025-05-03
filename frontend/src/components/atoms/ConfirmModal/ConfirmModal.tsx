import type { FC } from 'react';
import React from 'react';

import useEscape from '@/hooks/useEscape';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';

import Box from '../Box';
import { Typography } from '../Typography';
import { ConfirmModalActions } from './ConfirmModalActions';

export type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  description: string;
  isLoading?: boolean;
  onClose: () => void;
  onAccept: () => void;
  acceptButtonText?: string;
  cancelButtonText?: string;
  danger?: boolean;
  preventClosingOnOutside?: boolean;
};

export const ConfirmModal: FC<ConfirmModalProps> = ({
  isOpen,
  title,
  description,
  isLoading = false,
  onClose,
  onAccept,
  acceptButtonText,
  cancelButtonText,
  danger = true,
  preventClosingOnOutside = true,
}) => {
  const handleClose = () => !preventClosingOnOutside && onClose();

  useEscape(isOpen && preventClosingOnOutside, () => {
    if (
      document.activeElement &&
      'blur' in document.activeElement &&
      typeof document.activeElement.blur === 'function'
    ) {
      document.activeElement.blur();
    }

    onClose();
  });

  return (
    <Dialog
      as='div'
      className='relative z-10 focus:outline-none'
      open={isOpen}
      onClose={handleClose}
    >
      <DialogBackdrop
        className='fixed inset-0 bg-backdrop duration-200 data-[closed]:opacity-0'
        transition
      />
      <div className='fixed inset-0 z-10 w-screen'>
        <div className='flex min-h-full items-center justify-center p-4'>
          <DialogPanel
            className='flex w-[90%] max-w-[440px] flex-col rounded-2xl border-2 border-border-1 bg-background text-center outline-none backdrop-blur-md duration-200 data-[closed]:scale-90 data-[closed]:opacity-0'
            transition
          >
            <Box className='gap-2 p-6'>
              <Typography as='h2' size='xl' weight='bold'>
                {title}
              </Typography>
              <Typography color='secondary' size='s'>
                {description}
              </Typography>
              <ConfirmModalActions
                isLoading={isLoading}
                onAccept={onAccept}
                onClose={onClose}
                acceptButtonText={acceptButtonText}
                cancelButtonText={cancelButtonText}
                danger={danger}
              />
            </Box>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmModal;
