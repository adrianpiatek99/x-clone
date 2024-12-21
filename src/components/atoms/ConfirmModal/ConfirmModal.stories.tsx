import { useState } from 'react';

import type { Meta, StoryFn } from '@storybook/react';

import { Box } from '../Box';
import { Button } from '../Button';
import type { ConfirmModalProps } from '.';
import { ConfirmModal } from '.';

const meta = {
  title: 'Components / Atoms / ConfirmModal',
  component: ConfirmModal,
  decorators: [(Story) => <Box className='items-start'>{Story()}</Box>],
} satisfies Meta<ConfirmModalProps>;

export default meta;

const Template: StoryFn<ConfirmModalProps> = (args) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <Button onClick={() => setIsOpen((prev) => !prev)}>Open</Button>
      <ConfirmModal
        {...args}
        isOpen={isOpen}
        onAccept={() => setIsOpen(false)}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export const Playground = Template.bind({});

Playground.args = {
  title: 'Delete Post',
  description: 'Are you sure you want to delete this Post?',
  cancelButtonText: 'Cancel',
  acceptButtonText: 'Delete Post',
  isLoading: false,
  danger: true,
  preventClosingOnOutside: true,
};
