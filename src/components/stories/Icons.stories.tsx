import * as icons from '@/icons';
import type { Meta } from '@storybook/react';

import Icon from '../atoms/Icon';
import Tooltip from '../atoms/Tooltip';

const meta = {
  title: 'Design System / Icons',
} satisfies Meta;

export default meta;

export const Icons = () => (
  <div className='mx-auto flex w-full max-w-[800px] flex-wrap justify-center gap-4'>
    {Object.keys(icons).map((key) => (
      <Tooltip key={key} content={key}>
        <div className='flex w-max flex-col items-center gap-2'>
          <Icon name={key as keyof typeof icons} className='size-[36px] text-error-1' />
          <span className='w-[100px] truncate text-center'>{key}</span>
        </div>
      </Tooltip>
    ))}
  </div>
);
