import { Box } from '@/components/atoms/Box';
import { Button } from '@/components/atoms/Button';
import { DEFAULT_TOAST_DURATION, useToasts } from '@/hooks/useToasts';
import type { StoryFn } from '@storybook/react';

import type { CustomToastProps } from './CustomToast';

const meta = {
  title: 'Components / Atoms / CustomToast',
};

export default meta;

const Template: StoryFn<Omit<CustomToastProps, 'id' | 'type'> & { duration: number }> = ({
  message,
  duration,
}) => {
  const { addToast } = useToasts();

  return (
    <Box className='flex-row flex-wrap'>
      <Button onClick={() => addToast('success', message, { duration })}>Success</Button>
      <Button variant='tinted' onClick={() => addToast('information', message, { duration })}>
        Information
      </Button>
      <Button variant='gray' onClick={() => addToast('warning', message, { duration })}>
        Warning
      </Button>
      <Button
        variant='gray'
        color='danger'
        onClick={() => addToast('error', message, { duration })}
      >
        Error
      </Button>
    </Box>
  );
};

export const Playground = Template.bind({});

Playground.args = {
  message:
    'Lorem ipsum dolor sit amet, consectetur adip inc commodo sed diam et dolor lore mauris al typer amet.',
  duration: DEFAULT_TOAST_DURATION,
};
