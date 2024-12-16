import React from 'react';

import type { Meta, StoryFn } from '@storybook/react';

import type { TypographyProps } from '.';
import { Typography } from '.';

const meta = {
  title: 'Components / Atoms / Typography',
  component: Typography,
  decorators: [
    (Story) => <div className='flex w-full max-w-[400px] flex-col gap-3'>{Story()}</div>,
  ],
  argTypes: {
    truncate: {
      control: 'select',
      options: [false, true, 'max length x and text after'],
      mapping: {
        false: false,
        true: true,
        'max length x and text after': {
          maxLength: 20,
          textAfter: 'Read more',
        },
      },
    },
  },
} satisfies Meta<TypographyProps>;

export default meta;

const Template: StoryFn<TypographyProps> = (args) => <Typography {...args} />;

export const Playground = Template.bind({});

Playground.args = {
  as: 'span',
  size: 's',
  color: 'primary',
  weight: 'normal',
  children:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sit amet nunc a leo eleifend gravida sed ut odio.',
  center: false,
  truncate: false,
};

export const Sizes = () => (
  <>
    <Typography size='xs'>XS Size</Typography>
    <Typography size='s'>S Size</Typography>
    <Typography size='m'>M Size</Typography>
    <Typography size='l'>L Size</Typography>
    <Typography size='xl'>XL Size</Typography>
    <Typography size='2xl'>2XL Size</Typography>
    <Typography size='3xl'>3XL Size</Typography>
    <Typography size='4xl'>4XL Size</Typography>
  </>
);

export const Weights = () => (
  <>
    <Typography weight='light'>Light</Typography>
    <Typography weight='normal'>Normal</Typography>
    <Typography weight='medium'>Medium</Typography>
    <Typography weight='semibold'>Semi Bold</Typography>
    <Typography weight='bold'>Bold</Typography>
  </>
);
