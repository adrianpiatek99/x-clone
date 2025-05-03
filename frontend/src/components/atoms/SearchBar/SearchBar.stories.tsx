import { useState } from 'react';

import type { Meta, StoryFn } from '@storybook/react';

import Box from '../Box';
import type { SearchBarProps } from './SearchBar';
import SearchBar from './SearchBar';

const meta = {
  title: 'Components / Atoms / SearchBar',
  component: SearchBar,
  decorators: [(Story) => <Box className='w-full max-w-[450px]'>{Story()}</Box>],
} satisfies Meta<SearchBarProps>;

export default meta;

const Template: StoryFn<SearchBarProps> = (args) => {
  const [value, setValue] = useState('');

  return <SearchBar {...args} value={value} onChange={(newValue) => setValue(newValue)} />;
};

export const Playground = Template.bind({});

Playground.args = {
  value: '',
  disabled: false,
  fullWidth: true,
  placeholder: 'Search...',
};
