import type { Meta, StoryFn } from '@storybook/react';

import Box from '../Box';
import type { LoaderProps } from '.';
import Loader from '.';

const meta = {
  title: 'Components / Atoms / Loader',
  component: Loader,
  decorators: [(Story) => <Box className='relative  w-full max-w-[450px]'>{Story()}</Box>],
} satisfies Meta<LoaderProps>;

export default meta;

const Template: StoryFn<LoaderProps> = (args) => <Loader {...args} />;

export const Playground = Template.bind({});

Playground.args = {
  center: false,
};
