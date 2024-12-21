import {
  CloseIcon,
  EditProfileIcon,
  EmojiSmileIcon,
  HeartOutlinedIcon,
  PeopleIcon,
  RemoveOutlinedIcon,
  RepostIcon,
} from '@/icons';
import type { Meta, StoryFn } from '@storybook/react';

import { Box } from '../Box';
import { Button } from '../Button';
import type { DropdownProps } from './Dropdown';
import { Dropdown } from './Dropdown';
import { DropdownItem } from './DropdownItem';

const meta = {
  title: 'Components / Atoms / Dropdown',
  component: Dropdown,
} satisfies Meta<DropdownProps>;

export default meta;

const Template: StoryFn<DropdownProps> = (args) => (
  <Box className='ml-[25%]'>
    <Dropdown {...args}>
      <Button>Open</Button>
      <DropdownItem onClick={() => null} icon={<EditProfileIcon />}>
        Edit
      </DropdownItem>
      <DropdownItem onClick={() => null} icon={<PeopleIcon />}>
        Duplicate
      </DropdownItem>
      <DropdownItem onClick={() => null} icon={<RepostIcon />}>
        Repost
      </DropdownItem>
      <DropdownItem onClick={() => null} icon={<EmojiSmileIcon />} isLoading>
        Loading
      </DropdownItem>
      <DropdownItem onClick={() => null} icon={<CloseIcon />} disabled>
        Disabled
      </DropdownItem>
      <DropdownItem onClick={() => null} icon={<HeartOutlinedIcon />}>
        Like
      </DropdownItem>
      <DropdownItem onClick={() => null} icon={<RemoveOutlinedIcon />} danger>
        Delete
      </DropdownItem>
    </Dropdown>
  </Box>
);

export const Playground = Template.bind({});

Playground.args = {};
