import React from 'react';

import Box from '@/components/atoms/Box';
import type { Meta, StoryFn } from '@storybook/react';

import type { HeaderBarProps } from './HeaderBar';
import HeaderBar from './HeaderBar';

const meta = {
  title: 'Components / Molecules / HeaderBar',
  component: HeaderBar,
  decorators: [
    (Story) => <Box className='w-full max-w-[650px] border border-border-1'>{Story()}</Box>,
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<HeaderBarProps>;

export default meta;

const Template: StoryFn<HeaderBarProps> = (args) => <HeaderBar {...args} />;

export const Playground = Template.bind({});

Playground.args = {
  title: 'Header Bar',
  subtitle: 'Subtitle',
  showBackButton: true,
};
