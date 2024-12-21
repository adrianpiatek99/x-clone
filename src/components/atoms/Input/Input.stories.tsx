import { useState } from 'react';

import type { Meta, StoryFn } from '@storybook/react';

import { Box } from '../Box';
import type { InputProps } from '.';
import { Input } from '.';

const meta = {
  title: 'Components / Atoms / Input',
  component: Input,
  decorators: [(Story) => <Box className='w-full max-w-[300px]'>{Story()}</Box>],
} satisfies Meta<InputProps>;

export default meta;

const Template: StoryFn<InputProps> = (args) => {
  const [value, setValue] = useState('');

  return <Input {...args} value={value} onChange={(newValue) => setValue(newValue)} />;
};

export const Playground = Template.bind({});

Playground.args = {
  label: 'Email Address',
  name: 'email',
  value: '',
  error: '',
  isLoading: false,
  disabled: false,
};
