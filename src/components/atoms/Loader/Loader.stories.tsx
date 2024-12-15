import type { Meta, StoryFn } from '@storybook/react';

import type { LoaderProps } from '.';
import { Loader } from '.';

const meta = {
  title: 'Components / Atoms / Loader',
  component: Loader,
} satisfies Meta<LoaderProps>;

export default meta;

const Template: StoryFn<LoaderProps> = (args) => <Loader {...args} />;

export const Playground = Template.bind({});

Playground.args = {
  color: 'primary',
  center: false,
};
