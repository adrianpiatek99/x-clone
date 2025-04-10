import { useState } from 'react';

import Box from '@/components/atoms/Box';
import type { Meta, StoryFn } from '@storybook/react';

import { Tab } from './Tab';
import type { TabsProps } from './Tabs';
import Tabs from './Tabs';

const meta = {
  title: 'Components / Molecules / Tabs',
  component: Tabs,
  decorators: [(Story) => <Box className='w-fit'>{Story()}</Box>],
} satisfies Meta<TabsProps>;

export default meta;

const Template: StoryFn<TabsProps> = () => {
  const [currentTab, setCurrentTab] = useState('tab1');

  return (
    <Tabs value={currentTab} onChange={(tab) => setCurrentTab(tab)}>
      <Tab value='tab1'>Tab 1</Tab>
      <Tab value='tab2'>Tab 2</Tab>
      <Tab value='tab3'>Tab 3</Tab>
      <Tab value='tab4'>Tab 4</Tab>
      <Tab value='tab5'>Tab 5</Tab>
      <Tab value='tab6'>Long tab text text text text</Tab>
    </Tabs>
  );
};

export const Playground = Template.bind({});
