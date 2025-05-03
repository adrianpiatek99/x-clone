import type { Meta, StoryFn } from '@storybook/react';

import Icon from '../Icon';
import Button from '.';
import type { ButtonProps } from './Button';

const icons = {
  None: undefined,
  Play: <Icon name='PlayIcon' />,
  Settings: <Icon name='SettingsIcon' />,
  Trash: <Icon name='TrashIcon' />,
  Edit: <Icon name='EditProfileIcon' />,
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
          <Button variant='plain' size='small' startIcon={<Icon name='PlayIcon' />}>
            Play
          </Button>
        </td>
        <td>
          <Button variant='gray' size='small' startIcon={<Icon name='PlayIcon' />}>
            Play
          </Button>
        </td>
        <td>
          <Button variant='tinted' size='small' startIcon={<Icon name='PlayIcon' />}>
            Play
          </Button>
        </td>
        <td>
          <Button size='small' startIcon={<Icon name='PlayIcon' />}>
            Play
          </Button>
        </td>
      </tr>
      <tr className='[&>td>button]:mx-auto'>
        <td>Medium</td>
        <td>
          <Button variant='plain' startIcon={<Icon name='PlayIcon' />}>
            Play
          </Button>
        </td>
        <td>
          <Button variant='gray' startIcon={<Icon name='PlayIcon' />}>
            Play
          </Button>
        </td>
        <td>
          <Button variant='tinted' startIcon={<Icon name='PlayIcon' />}>
            Play
          </Button>
        </td>
        <td>
          <Button startIcon={<Icon name='PlayIcon' />}>Play</Button>
        </td>
      </tr>
      <tr className='[&>td>button]:mx-auto'>
        <td>Large</td>
        <td>
          <Button variant='plain' size='large' startIcon={<Icon name='PlayIcon' />}>
            Play
          </Button>
        </td>
        <td>
          <Button variant='gray' size='large' startIcon={<Icon name='PlayIcon' />}>
            Play
          </Button>
        </td>
        <td>
          <Button variant='tinted' size='large' startIcon={<Icon name='PlayIcon' />}>
            Play
          </Button>
        </td>
        <td>
          <Button size='large' startIcon={<Icon name='PlayIcon' />}>
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
          <Button variant='plain' startIcon={<Icon name='PlayIcon' />}>
            Play
          </Button>
        </td>
        <td>
          <Button variant='gray' startIcon={<Icon name='PlayIcon' />}>
            Play
          </Button>
        </td>
        <td>
          <Button variant='tinted' startIcon={<Icon name='PlayIcon' />}>
            Play
          </Button>
        </td>
        <td>
          <Button startIcon={<Icon name='PlayIcon' />}>Play</Button>
        </td>
      </tr>
      <tr className='[&>td>button]:mx-auto'>
        <td>Danger</td>
        <td>
          <Button variant='plain' color='danger' startIcon={<Icon name='PlayIcon' />}>
            Play
          </Button>
        </td>
        <td>
          <Button variant='gray' color='danger' startIcon={<Icon name='PlayIcon' />}>
            Play
          </Button>
        </td>
        <td>
          <Button variant='tinted' color='danger' startIcon={<Icon name='PlayIcon' />}>
            Play
          </Button>
        </td>
        <td>
          <Button color='danger' startIcon={<Icon name='PlayIcon' />}>
            Play
          </Button>
        </td>
      </tr>
    </tbody>
  </table>
);
