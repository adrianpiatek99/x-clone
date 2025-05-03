import React from 'react';

import { useGlobalStore } from '@/stores/global';
import { Dialog, DialogPanel } from '@headlessui/react';
import { DialogBackdrop } from '@headlessui/react';
import { useShallow } from 'zustand/shallow';

import Footer from '../Footer';
import NavigationDrawerHeader from './NavigationDrawerHeader';
import NavigationDrawerList from './NavigationDrawerList';

const NavigationDrawer = () => {
  const {
    mobileDrawer: { isOpen },
    updateMobileDrawer,
  } = useGlobalStore(
    useShallow((state) => ({
      mobileDrawer: state.mobileDrawer,
      updateMobileDrawer: state.updateMobileDrawer,
    }))
  );

  const handleClose = () => updateMobileDrawer({ isOpen: false });

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
            className='hide-scrollbar absolute inset-y-0 left-0 flex h-full w-[90%] max-w-[320px] flex-col overflow-hidden border-r border-border-1 bg-background outline-none duration-200 data-[closed]:-translate-x-full'
            transition
          >
            <NavigationDrawerHeader />
            <NavigationDrawerList />
            <div className='mt-auto px-6 py-4'>
              <Footer />
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default NavigationDrawer;
