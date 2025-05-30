'use client';

import type { ComponentPropsWithoutRef, FC, ReactElement, ReactNode } from 'react';
import React, { useState } from 'react';

import DiscardChangesModal from '@/components/molecules/DiscardChangesModal';
import useEscape from '@/hooks/useEscape';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';

import { ModalHeader } from './ModalHeader';

export type ModalProps = {
  children: ReactNode;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onAccept?: () => void;
  title?: string | ReactElement;
  acceptButtonText?: string;
  acceptButtonProps?: Omit<ComponentPropsWithoutRef<'button'>, 'color'>;
  preventClosingOnOutside?: boolean;
  panel?: {
    className?: string;
  };
  discardChanges?: {
    isChanged: boolean;
  };
};

const Modal: FC<ModalProps> = ({
  children,
  isOpen,
  isLoading = false,
  onClose,
  onAccept,
  title,
  acceptButtonProps,
  acceptButtonText,
  preventClosingOnOutside,
  panel,
  discardChanges,
}) => {
  const [isDiscardChangesModalOpen, setIsDiscardChangesModalOpen] = useState(false);

  const handleClose = () => {
    if (discardChanges?.isChanged) {
      setIsDiscardChangesModalOpen(true);

      return;
    }

    onClose();
  };

  const handleBackdropClose = () => {
    if (preventClosingOnOutside || isLoading) return;

    handleClose();
  };

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
      onClose={handleBackdropClose}
    >
      <DialogBackdrop
        className='fixed inset-0 bg-backdrop duration-200 data-[closed]:opacity-0'
        transition
      />
      <div className='fixed inset-0 z-10 w-screen'>
        <div className='flex min-h-full items-center justify-center p-4'>
          <DialogPanel
            className={twMerge(
              'absolute bottom-[calc(env(safe-area-inset-bottom))] flex max-h-[94vh] min-h-[250px] w-[98%] max-w-[500px] flex-col border-2 border-border-1 overflow-x-hidden rounded-t-2xl bg-background pb-[73px] shadow outline-0 duration-200 data-[closed]:translate-y-full sm:static sm:h-auto sm:max-h-[90vh] sm:w-[95%] sm:max-w-[600px] sm:rounded-2xl sm:pb-[53px] sm:data-[closed]:translate-y-0 sm:data-[closed]:scale-90 sm:data-[closed]:opacity-0',
              panel?.className
            )}
            transition
          >
            <ModalHeader
              title={title}
              onClose={handleClose}
              onAccept={onAccept}
              acceptButtonText={acceptButtonText}
              acceptButtonProps={acceptButtonProps}
              isLoading={isLoading}
            />
            {children}
          </DialogPanel>
        </div>
      </div>
      <DiscardChangesModal
        isOpen={isDiscardChangesModalOpen}
        onDiscardClose={() => setIsDiscardChangesModalOpen(false)}
        onClose={onClose}
      />
    </Dialog>
  );
};

export default Modal;
