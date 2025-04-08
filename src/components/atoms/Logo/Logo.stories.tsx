import type { Meta, StoryFn } from '@storybook/react';

import Box from '../Box';
import type { LogoProps } from '.';
import Logo from '.';

const meta = {
  title: 'Components / Atoms / Logo',
  component: Logo,
  decorators: [(Story) => <Box>{Story()}</Box>],
} satisfies Meta<LogoProps>;

export default meta;

const Template: StoryFn<LogoProps> = (args) => <Logo {...args} />;

export const Playground = Template.bind({});

Playground.args = {};
