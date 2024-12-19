import { useState } from 'react';

import type { Meta, StoryFn } from '@storybook/react';

import type { RadioGroupProps } from './RadioGroup';
import { RadioGroup } from './RadioGroup';
import type { RadioGroupItemProps } from './RadioGroupItem';
import { RadioGroupItem } from './RadioGroupItem';

const meta = {
  title: 'Components / Atoms / RadioGroup',
  decorators: [
    (Story) => <div className='flex w-full max-w-[500px] flex-col gap-3'>{Story()}</div>,
  ],
} satisfies Meta<RadioGroupProps>;

export default meta;

const radioOptions: Omit<RadioGroupItemProps, 'name'>[] = [
  {
    value: 'value1',
    label: 'Label 1',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit mauris vel aliquam porta.',
  },
  {
    value: 'value2',
    label: 'Label 2',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit mauris vel aliquam porta.',
  },
  {
    value: 'value3',
    label: 'Label 3',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit mauris vel aliquam porta.',
  },
  {
    value: 'value4',
    label: 'Label 4',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit mauris vel aliquam porta.',
  },
];

const Template: StoryFn<RadioGroupItemProps> = (args) => (
  <RadioGroup {...args}>
    <RadioGroupItem {...args} />
  </RadioGroup>
);

export const Playground = Template.bind({});

Playground.args = {
  label: 'Label',
  description: 'Description',
  checked: false,
  disabled: false,
  name: 'radioItem',
};

export const RadioItems = () => {
  const [value, setValue] = useState(radioOptions[0].value);

  return (
    <RadioGroup title='Title'>
      {radioOptions.map((option) => (
        <RadioGroupItem
          key={option.value}
          {...option}
          name='radioGroup'
          checked={value === option.value}
          onChange={({ target }) => setValue(target.value)}
        >
          <div className='flex items-center'>
            <div className='flex size-[50px] rounded-full bg-text-2' />
          </div>
        </RadioGroupItem>
      ))}
    </RadioGroup>
  );
};
