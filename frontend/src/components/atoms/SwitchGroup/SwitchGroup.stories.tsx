import type { ReactElement } from 'react';
import { useState } from 'react';

import type { Meta, StoryFn } from '@storybook/react';

import Box from '../Box';
import Icon from '../Icon';
import type { SwitchProps } from './Switch';
import { Switch } from './Switch';
import type { SwitchGroupProps } from './SwitchGroup';
import SwitchGroup from './SwitchGroup';

const meta: Meta<SwitchGroupProps> = {
  title: 'Components / Atoms / SwitchGroup',
  decorators: [(Story) => <Box className='w-full max-w-[500px] gap-6'>{Story()}</Box>],
};

export default meta;

const Template: StoryFn<SwitchProps> = (args) => {
  const [checked, setChecked] = useState(true);

  return (
    <SwitchGroup>
      <Switch {...args} checked={checked} onChange={(value) => setChecked(value)} />
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
        <Switch
          label='Label 1'
          name='name1'
          checked={isCheckedOne}
          onChange={(checked) => setIsCheckedOne(checked)}
          description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit mauris vel aliquam porta.'
        >
          <Icon name='NotificationIcon' className='size-[24px] fill-primary' />
        </Switch>
        <Switch
          label='Label 2'
          name='name2'
          checked={isCheckedTwo}
          onChange={(checked) => setIsCheckedTwo(checked)}
          description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit mauris vel aliquam porta.'
        >
          <Icon name='VerifiedIcon' className='size-[24px] fill-primary text-primary' />
        </Switch>
        <Switch
          label='Label 3'
          name='name3'
          checked={isCheckedThree}
          onChange={(checked) => setIsCheckedThree(checked)}
          description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit mauris vel aliquam porta.'
        >
          <Icon name='SettingsIcon' className='size-[24px] fill-primary text-primary' />
        </Switch>
      </SwitchGroup>
      <SwitchGroup title='Title 2'>
        <Switch
          label='Label 1'
          name='name1'
          checked={isCheckedOne}
          onChange={(checked) => setIsCheckedOne(checked)}
        />
        <Switch
          label='Label 2'
          name='name2'
          checked={isCheckedTwo}
          onChange={(checked) => setIsCheckedTwo(checked)}
        />
        <Switch
          label='Label 3'
          name='name3'
          checked={isCheckedThree}
          onChange={(checked) => setIsCheckedThree(checked)}
        />
      </SwitchGroup>
    </>
  );
};
