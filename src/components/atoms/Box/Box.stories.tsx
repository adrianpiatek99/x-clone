import type { Meta, StoryFn } from '@storybook/react';

import type { BoxProps } from './Box';
import { Box } from './Box';

const items = [
  'Item 1',
  'Item 2',
  'Item 3',
  'Item 4',
  'Item 5',
  'Item 6',
  'Item 7',
  'Item 8',
  'Item 9',
  'Item 10',
  'Item 11',
  'Item 12',
  'Item 13',
  'Item 14',
  'Item 15',
];

const meta: Meta<BoxProps> = {
  title: 'Components / Atoms / Box',
  component: Box,
  decorators: [(Story) => <Box className='mx-auto max-w-[800px]'>{Story()}</Box>],
};

export default meta;

const Template: StoryFn<BoxProps> = (args) => (
  <Box {...args}>
    {items.map((item) => (
      <div key={item} className='rounded-lg bg-foreground p-3'>
        {item}
      </div>
    ))}
  </Box>
);

export const Playground = Template.bind({});

Playground.args = {
  as: 'div',
};
