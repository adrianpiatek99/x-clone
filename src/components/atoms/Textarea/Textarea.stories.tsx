import { useState } from 'react';

import type { Meta, StoryFn } from '@storybook/react';

import { Box } from '../Box';
import type { TextareaProps } from '.';
import { Textarea } from '.';

const meta = {
  title: 'Components / Atoms / Textarea',
  component: Textarea,
  decorators: [(Story) => <Box className='w-1/2'>{Story()}</Box>],
} satisfies Meta<TextareaProps>;

export default meta;

const Template: StoryFn<TextareaProps> = (args) => {
  const [value, setValue] = useState('');

  return <Textarea {...args} value={value} onValueChange={(newValue) => setValue(newValue)} />;
};

export const Playground = Template.bind({});

Playground.args = {
  name: 'textarea',
  label: 'What is happening?!',
  isLoading: false,
  disabled: false,
  error: '',
};
