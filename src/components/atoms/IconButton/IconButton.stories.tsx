import type { FC } from 'react';

import { CloseIcon, EditProfileIcon, HeartIcon, PlayIcon } from '@/icons';
import type { Meta, StoryFn } from '@storybook/react';

import type { IconButtonProps } from '.';
import { IconButton } from '.';

const icons = {
  Play: <PlayIcon />,
  Like: <HeartIcon />,
  Close: <CloseIcon />,
  Edit: <EditProfileIcon />,
};

const meta = {
  title: 'Components / Atoms / IconButton',
  component: IconButton as FC,
  argTypes: {
    children: {
      options: Object.keys(icons),
      mapping: icons,
      control: 'select',
    },
  },
  decorators: [(Story) => <div className='flex'>{Story()}</div>],
} satisfies Meta<IconButtonProps>;

export default meta;

const Template: StoryFn<IconButtonProps> = (args) => <IconButton {...args} />;

export const Playground = Template.bind({});

Playground.args = {
  children: <HeartIcon />,
  title: '',
  color: 'primary',
  size: 'medium',
  disabled: false,
  isActive: false,
  disableFocus: false,
};

export const ColorsAndSizes = () => {
  return (
    <table className='w-fit border-collapse' cellPadding='10'>
      <thead>
        <tr className='text-center'>
          <td></td>
          <td>Primary</td>
          <td>Secondary</td>
          <td>Danger</td>
          <td>White</td>
          <td>Dark</td>
          <td>Custom color</td>
        </tr>
      </thead>
      <tbody>
        <tr className='[&>td>button]:mx-auto'>
          <td>Small</td>
          <td>
            <IconButton title='Small' size='small'>
              <HeartIcon />
            </IconButton>
          </td>
          <td>
            <IconButton color='secondary' title='Small' size='small'>
              <HeartIcon />
            </IconButton>
          </td>
          <td>
            <IconButton color='danger' title='Small' size='small'>
              <HeartIcon />
            </IconButton>
          </td>
          <td>
            <IconButton color='white' title='Small' size='small'>
              <HeartIcon />
            </IconButton>
          </td>
          <td>
            <IconButton color='darker' title='Small' size='small'>
              <HeartIcon />
            </IconButton>
          </td>
          <td>
            <IconButton
              title='Custom color'
              className='bg-emerald/0 text-emerald focus-visible:bg-emerald/10 enabled:hover:bg-emerald/10 enabled:active:bg-emerald/20'
              size='small'
            >
              <HeartIcon />
            </IconButton>
          </td>
        </tr>
        <tr className='[&>td>button]:mx-auto'>
          <td>Medium</td>
          <td>
            <IconButton title='Medium'>
              <HeartIcon />
            </IconButton>
          </td>
          <td>
            <IconButton color='secondary' title='Medium'>
              <HeartIcon />
            </IconButton>
          </td>
          <td>
            <IconButton color='danger' title='Medium'>
              <HeartIcon />
            </IconButton>
          </td>
          <td>
            <IconButton color='white' title='Medium'>
              <HeartIcon />
            </IconButton>
          </td>
          <td>
            <IconButton color='darker' title='Medium'>
              <HeartIcon />
            </IconButton>
          </td>
          <td>
            <IconButton
              title='Custom color'
              className='bg-emerald/0 text-emerald focus-visible:bg-emerald/10 enabled:hover:bg-emerald/10 enabled:active:bg-emerald/20'
            >
              <HeartIcon />
            </IconButton>
          </td>
        </tr>
        <tr className='[&>td>button]:mx-auto'>
          <td>Large</td>
          <td>
            <IconButton title='Large' size='large'>
              <HeartIcon />
            </IconButton>
          </td>
          <td>
            <IconButton color='secondary' title='Large' size='large'>
              <HeartIcon />
            </IconButton>
          </td>
          <td>
            <IconButton color='danger' title='Large' size='large'>
              <HeartIcon />
            </IconButton>
          </td>
          <td>
            <IconButton color='white' title='Large' size='large'>
              <HeartIcon />
            </IconButton>
          </td>
          <td>
            <IconButton color='darker' title='Large' size='large'>
              <HeartIcon />
            </IconButton>
          </td>
          <td>
            <IconButton
              title='Custom color'
              className='bg-emerald/0 text-emerald focus-visible:bg-emerald/10 enabled:hover:bg-emerald/10 enabled:active:bg-emerald/20'
              size='large'
            >
              <HeartIcon />
            </IconButton>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export const WithLabel = () => {
  return (
    <table className='w-fit border-collapse' cellPadding='10'>
      <thead>
        <tr className='text-center'>
          <td></td>
          <td>Custom color 1</td>
          <td>Custom color 2</td>
        </tr>
      </thead>
      <tbody>
        <tr className='[&>td>button]:mx-auto'>
          <td>Small</td>
          <td>
            <IconButton
              title='Custom color'
              label='1000'
              className='bg-emerald/0 text-emerald focus-visible:bg-emerald/10 enabled:hover:bg-emerald/10 enabled:active:bg-emerald/20'
              size='small'
            >
              <HeartIcon />
            </IconButton>
          </td>
          <td>
            <IconButton
              title='Custom color'
              label='23245'
              className='bg-pink/0 text-pink focus-visible:bg-pink/10 enabled:hover:bg-pink/10 enabled:active:bg-pink/20'
              size='small'
            >
              <HeartIcon />
            </IconButton>
          </td>
        </tr>
        <tr className='[&>td>button]:mx-auto'>
          <td>Medium</td>
          <td>
            <IconButton
              title='Custom color'
              label='1000'
              className='bg-emerald/0 text-emerald focus-visible:bg-emerald/10 enabled:hover:bg-emerald/10 enabled:active:bg-emerald/20'
            >
              <HeartIcon />
            </IconButton>
          </td>
          <td>
            <IconButton
              title='Custom color'
              label='23245'
              className='bg-pink/0 text-pink focus-visible:bg-pink/10 enabled:hover:bg-pink/10 enabled:active:bg-pink/20'
            >
              <HeartIcon />
            </IconButton>
          </td>
        </tr>
        <tr className='[&>td>button]:mx-auto'>
          <td>Large</td>
          <td>
            <IconButton
              title='Custom color'
              label='1000'
              className='bg-emerald/0 text-emerald focus-visible:bg-emerald/10 enabled:hover:bg-emerald/10 enabled:active:bg-emerald/20'
              size='large'
            >
              <HeartIcon />
            </IconButton>
          </td>
          <td>
            <IconButton
              title='Custom color'
              label='23245'
              className='bg-pink/0 text-pink focus-visible:bg-pink/10 enabled:hover:bg-pink/10 enabled:active:bg-pink/20'
              size='large'
            >
              <HeartIcon />
            </IconButton>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
