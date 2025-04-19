import type { PropsWithChildren } from 'react';
import React from 'react';

import Box from '@/components/atoms/Box';
import { Transition } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';

type Props = {
  isVisible: boolean;
  onClick?: () => void;
} & PropsWithChildren;

const PillNotify = ({ isVisible, onClick, children }: Props) => {
  return (
    <div className='pointer-events-none absolute top-[15px] z-[5] h-0 w-full'>
      <div className='pointer-events-auto flex justify-center'>
        <Transition show={isVisible}>
          <button
            className={twMerge(
              'select-none rounded-full bg-accent-1/80 px-3 py-2 shadow-lg backdrop-blur-md duration-200 cursor-default',
              onClick && 'enabled:active:bg-text-1/15 enabled:hover:bg-text-1/10 cursor-pointer',
              'data-[closed]:scale-0 data-[closed]:opacity-0 data-[closed]:-translate-y-full'
            )}
            onClick={onClick}
            tabIndex={-1}
          >
            <Box className='flex-row items-center gap-2'>{children}</Box>
          </button>
        </Transition>
      </div>
    </div>
  );
};

export default PillNotify;
