import type { ReactElement } from 'react';
import { useState } from 'react';

import { NotificationIcon, SettingsIcon, VerifiedIcon } from '@/icons';
import type { Meta, StoryFn } from '@storybook/react';

import type { SwitchGroupProps } from './SwitchGroup';
import { SwitchGroup } from './SwitchGroup';
import type { SwitchGroupItemProps } from './SwitchGroupItem';
import { SwitchGroupItem } from './SwitchGroupItem';

const meta: Meta<SwitchGroupProps> = {
  title: 'Components / Atoms / SwitchGroup',
  decorators: [
    (Story) => <div className='flex w-full max-w-[500px] flex-col gap-6'>{Story()}</div>,
  ],
};

export default meta;

const Template: StoryFn<SwitchGroupItemProps> = (args) => {
  const [checked, setChecked] = useState(true);

  return (
    <SwitchGroup>
      <SwitchGroupItem {...args} checked={checked} onChange={(value) => setChecked(value)} />
    </SwitchGroup>
  );
};

export const Playground = Template.bind({});

Playground.args = {
  label: 'Test',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit mauris vel aliquam porta.',
  disabled: false,
  children: 'X' as unknown as ReactElement,
  name: '',
};

export const SwitchItems = () => {
  const [isCheckedOne, setIsCheckedOne] = useState(true);
  const [isCheckedTwo, setIsCheckedTwo] = useState(true);
  const [isCheckedThree, setIsCheckedThree] = useState(false);

  return (
    <>
      <SwitchGroup title='Title 1'>
        <SwitchGroupItem
          label='Label 1'
          name='name1'
          checked={isCheckedOne}
          onChange={(checked) => setIsCheckedOne(checked)}
          description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit mauris vel aliquam porta.'
        >
          <NotificationIcon className='size-[24px] fill-primary' />
        </SwitchGroupItem>
        <SwitchGroupItem
          label='Label 2'
          name='name2'
          checked={isCheckedTwo}
          onChange={(checked) => setIsCheckedTwo(checked)}
          description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit mauris vel aliquam porta.'
        >
          <VerifiedIcon className='size-[24px] fill-primary text-primary' />
        </SwitchGroupItem>
        <SwitchGroupItem
          label='Label 3'
          name='name3'
          checked={isCheckedThree}
          onChange={(checked) => setIsCheckedThree(checked)}
          description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit mauris vel aliquam porta.'
        >
          <SettingsIcon className='size-[24px] fill-primary text-primary' />
        </SwitchGroupItem>
      </SwitchGroup>
      <SwitchGroup title='Title 2'>
        <SwitchGroupItem
          label='Label 1'
          name='name1'
          checked={isCheckedOne}
          onChange={(checked) => setIsCheckedOne(checked)}
        />
        <SwitchGroupItem
          label='Label 2'
          name='name2'
          checked={isCheckedTwo}
          onChange={(checked) => setIsCheckedTwo(checked)}
        />
        <SwitchGroupItem
          label='Label 3'
          name='name3'
          checked={isCheckedThree}
          onChange={(checked) => setIsCheckedThree(checked)}
        />
      </SwitchGroup>
    </>
  );
};
