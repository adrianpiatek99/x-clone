import type { Meta, StoryFn } from '@storybook/react';

import { Box } from '../Box';
import type { LinearProgressProps } from '.';
import { LinearProgress } from '.';

const meta = {
  title: 'Components / Atoms / LinearProgress',
  component: LinearProgress,
  decorators: [(Story) => <Box className='relative h-[50vh] w-full max-w-[450px]'>{Story()}</Box>],
} satisfies Meta<LinearProgressProps>;

export default meta;

const Template: StoryFn<LinearProgressProps> = (args) => <LinearProgress {...args} />;

export const Playground = Template.bind({});

Playground.args = {
  position: 'top',
};
