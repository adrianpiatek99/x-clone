import React from 'react';

import Icon from '@/components/atoms/Icon';
import IconButton from '@/components/atoms/IconButton';
import { useCreatePostStore } from '@/stores/createPost';

export const NavigationTabsCreatePost = () => {
  const updateCreatePostModal = useCreatePostStore((state) => state.updateModal);

  const handleOpenCreatePostModal = () => updateCreatePostModal({ isOpen: true });

  return (
    <IconButton
      className='bg-accent-1/80 mx-1 flex min-h-[38px] px-4 [&>svg]:size-[32px]'
      onClick={handleOpenCreatePostModal}
      color='white'
    >
      <Icon name='PlusIcon' />
    </IconButton>
  );
};
