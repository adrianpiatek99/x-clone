import type { Meta, StoryFn } from '@storybook/react';

import Box from '../Box';
import Button from '../Button';
import Icon from '../Icon';
import Dropdown, { DropdownItem } from '.';
import type { DropdownProps } from './Dropdown';

const meta = {
  title: 'Components / Atoms / Dropdown',
  component: Dropdown,
} satisfies Meta<DropdownProps>;

export default meta;

const Template: StoryFn<DropdownProps> = (args) => (
  <Box className='ml-[25%]'>
    <Dropdown {...args}>
      <Button>Open</Button>
      <DropdownItem onClick={() => null} icon={<Icon name='EditProfileIcon' />}>
        Edit
      </DropdownItem>
      <DropdownItem onClick={() => null} icon={<Icon name='PeopleIcon' />}>
        Duplicate
      </DropdownItem>
      <DropdownItem onClick={() => null} icon={<Icon name='RepostIcon' />}>
        Repost
      </DropdownItem>
      <DropdownItem onClick={() => null} icon={<Icon name='EmojiSmileIcon' />} isLoading>
        Loading
      </DropdownItem>
      <DropdownItem onClick={() => null} icon={<Icon name='CloseIcon' />} disabled>
        Disabled
      </DropdownItem>
      <DropdownItem onClick={() => null} icon={<Icon name='HeartOutlinedIcon' />}>
        Like
      </DropdownItem>
      <DropdownItem onClick={() => null} icon={<Icon name='RemoveIcon' />} danger>
        Delete
      </DropdownItem>
    </Dropdown>
  </Box>
);

export const Playground = Template.bind({});

Playground.args = {};
