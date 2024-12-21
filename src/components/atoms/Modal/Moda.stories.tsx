import { useState } from 'react';

import type { Meta, StoryFn } from '@storybook/react';

import { Button } from '../Button';
import type { ModalProps } from '.';
import { Modal } from '.';

const meta = {
  title: 'Components / Atoms / Modal',
  component: Modal,
  decorators: [
    (Story) => <div className='flex flex-col items-start gap-3 overflow-hidden'>{Story()}</div>,
  ],
} satisfies Meta<ModalProps>;

export default meta;

const Template: StoryFn<ModalProps> = (args) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal {...args} isOpen={isOpen} onClose={handleClose} onAccept={handleClose}>
        <div className='min-h-[450px]' />
      </Modal>
    </>
  );
};

export const Playground = Template.bind({});

Playground.args = {
  title: 'Modal',
  acceptButtonText: 'Save',
  isLoading: false,
  acceptButtonProps: { disabled: false },
  preventClosingOnOutside: false,
};
