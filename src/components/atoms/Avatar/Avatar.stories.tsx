import { DEFAULT_AVATAR_URL } from '@/constants/urls';
import type { Meta, StoryFn } from '@storybook/react';

import type { AvatarProps } from '.';
import { Avatar } from '.';

const meta = {
  title: 'Components / Atoms / Avatar',
  component: Avatar,
  decorators: [(Story) => <div className='flex items-center gap-3'>{Story()}</div>],
} satisfies Meta<AvatarProps>;

export default meta;

const Template: StoryFn<AvatarProps> = (args) => <Avatar {...args} />;

export const Playground = Template.bind({});

Playground.args = {
  src: DEFAULT_AVATAR_URL,
  size: 'medium',
  screenName: 'Profile',
  isLoading: false,
};

export const Sizes = () => (
  <>
    <Avatar size='small' src={DEFAULT_AVATAR_URL} onClick={() => null} />
    <Avatar src={DEFAULT_AVATAR_URL} onClick={() => null} />
    <Avatar size='large' src={DEFAULT_AVATAR_URL} onClick={() => null} />
    <Avatar size='extraLarge' src={DEFAULT_AVATAR_URL} href='link' />
    <Avatar size='profile' src={DEFAULT_AVATAR_URL} href='link' />
  </>
);
