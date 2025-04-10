import React from 'react';

import Button from '@/components/atoms/Button';
import { PlusIcon } from '@/icons';
import { useCreatePostStore } from '@/stores/createPost';

export const NavigationTabsCreatePost = () => {
  const updateCreatePostModal = useCreatePostStore((state) => state.updateModal);

  const handleOpenCreatePostModal = () => updateCreatePostModal({ isOpen: true });

  return (
    <Button
      className='absolute right-4 top-[-67px] size-[50px] rounded-full shadow-sm transition duration-200 active:scale-80'
      onClick={handleOpenCreatePostModal}
      tabIndex={-1}
    >
      <PlusIcon className='size-[34px]' />
    </Button>
  );
};
