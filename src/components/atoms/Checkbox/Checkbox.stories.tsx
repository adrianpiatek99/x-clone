import type { Meta, StoryFn } from '@storybook/react';

import type { CheckboxProps } from './Checkbox';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components / Atoms / Checkbox',
  component: Checkbox,
  decorators: [
    (Story) => <div className='flex w-full max-w-[500px] flex-col gap-3'>{Story()}</div>,
  ],
} satisfies Meta<CheckboxProps>;

export default meta;

const Template: StoryFn<CheckboxProps> = (args) => <Checkbox {...args} />;

export const Playground = Template.bind({});

Playground.args = {
  label: 'Label',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit mauris vel aliquam porta.',
  disabled: false,
  name: 'checkbox',
};

export const CheckboxGroup = () => (
  <>
    <Checkbox checked name='1' label='News about X product and feature updates' />
    <Checkbox checked={false} name='1' label='Tips on getting more out of X' />
    <Checkbox checked name='1' label='Things you missed since you last logged into X' />
    <Checkbox
      checked={false}
      name='1'
      label='News about X on partner products and other third party services services'
    />
    <Checkbox checked={false} name='1' label='Participation in X research surveys' />
    <Checkbox checked name='1' label='Suggestions for recommended accounts' />
    <Checkbox checked name='1' label='Suggestions based on your recent follows' />
  </>
);
