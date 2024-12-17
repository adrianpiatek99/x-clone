import type { FC } from 'react';
import { useState } from 'react';

import type { Meta, StoryFn } from '@storybook/react';

import type { SearchBarProps } from './SearchBar';
import { SearchBar } from './SearchBar';

const meta = {
  title: 'Components / Atoms / SearchBar',
  component: SearchBar as unknown as FC,
  decorators: [(Story) => <div className='flex w-full max-w-[450px]'>{Story()}</div>],
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
