import { EditProfileIcon, PlayIcon, SettingsIcon, TrashIcon } from '@/icons';
import type { Meta, StoryFn } from '@storybook/react';

import type { ButtonProps } from './Button';
import { Button } from './Button';

const icons = {
  None: undefined,
  Play: <PlayIcon />,
  Settings: <SettingsIcon />,
  Trash: <TrashIcon />,
  Edit: <EditProfileIcon />,
};

const meta = {
  title: 'Components / Atoms / Button',
  component: Button,
  argTypes: {
    startIcon: {
      options: Object.keys(icons),
      mapping: icons,
      control: 'select',
    },
  },
} satisfies Meta<ButtonProps>;

export default meta;

const Template: StoryFn<ButtonProps> = (args) => (
  <div className='flex max-w-[250px]'>
    <Button {...args} />
  </div>
);

export const Playground = Template.bind({});

Playground.args = {
  children: 'Button',
  variant: 'filled',
  color: 'primary',
  size: 'medium',
  align: 'center',
  disabled: false,
  fullWidth: false,
  isLoading: false,
  rounded: 'full',
};

export const VariantsAndSizes = () => (
  <table className='w-fit border-collapse' cellPadding='10'>
    <thead>
      <tr className='text-center'>
        <td></td>
        <td>Plain</td>
        <td>Gray</td>
        <td>Tinted</td>
        <td>Filled</td>
      </tr>
    </thead>
    <tbody>
      <tr className='[&>td>button]:mx-auto'>
        <td>Small</td>
        <td>
          <Button variant='plain' size='small' startIcon={<PlayIcon />}>
            Play
          </Button>
        </td>
        <td>
          <Button variant='gray' size='small' startIcon={<PlayIcon />}>
            Play
          </Button>
        </td>
        <td>
          <Button variant='tinted' size='small' startIcon={<PlayIcon />}>
            Play
          </Button>
        </td>
        <td>
          <Button size='small' startIcon={<PlayIcon />}>
            Play
          </Button>
        </td>
      </tr>
      <tr className='[&>td>button]:mx-auto'>
        <td>Medium</td>
        <td>
          <Button variant='plain' startIcon={<PlayIcon />}>
            Play
          </Button>
        </td>
        <td>
          <Button variant='gray' startIcon={<PlayIcon />}>
            Play
          </Button>
        </td>
        <td>
          <Button variant='tinted' startIcon={<PlayIcon />}>
            Play
          </Button>
        </td>
        <td>
          <Button startIcon={<PlayIcon />}>Play</Button>
        </td>
      </tr>
      <tr className='[&>td>button]:mx-auto'>
        <td>Large</td>
        <td>
          <Button variant='plain' size='large' startIcon={<PlayIcon />}>
            Play
          </Button>
        </td>
        <td>
          <Button variant='gray' size='large' startIcon={<PlayIcon />}>
            Play
          </Button>
        </td>
        <td>
          <Button variant='tinted' size='large' startIcon={<PlayIcon />}>
            Play
          </Button>
        </td>
        <td>
          <Button size='large' startIcon={<PlayIcon />}>
            Play
          </Button>
        </td>
      </tr>
    </tbody>
  </table>
);

export const Colors = () => (
  <table className='w-fit border-collapse' cellPadding='10'>
    <thead>
      <tr className='text-center'>
        <td></td>
        <td>Plain</td>
        <td>Gray</td>
        <td>Tinted</td>
        <td>Filled</td>
      </tr>
    </thead>
    <tbody>
      <tr className='[&>td>button]:mx-auto'>
        <td>Primary</td>
        <td>
          <Button variant='plain' startIcon={<PlayIcon />}>
            Play
          </Button>
        </td>
        <td>
          <Button variant='gray' startIcon={<PlayIcon />}>
            Play
          </Button>
        </td>
        <td>
          <Button variant='tinted' startIcon={<PlayIcon />}>
            Play
          </Button>
        </td>
        <td>
          <Button startIcon={<PlayIcon />}>Play</Button>
        </td>
      </tr>
      <tr className='[&>td>button]:mx-auto'>
        <td>Danger</td>
        <td>
          <Button variant='plain' color='danger' startIcon={<PlayIcon />}>
            Play
          </Button>
        </td>
        <td>
          <Button variant='gray' color='danger' startIcon={<PlayIcon />}>
            Play
          </Button>
        </td>
        <td>
          <Button variant='tinted' color='danger' startIcon={<PlayIcon />}>
            Play
          </Button>
        </td>
        <td>
          <Button color='danger' startIcon={<PlayIcon />}>
            Play
          </Button>
        </td>
      </tr>
    </tbody>
  </table>
);
