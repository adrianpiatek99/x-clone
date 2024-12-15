import { createElement } from 'react';

import * as icons from '@/icons';
import type { Meta } from '@storybook/react';

import { Tooltip } from '../atoms/Tooltip';

const meta = {
  title: 'Design System / Icons',
} satisfies Meta;

export default meta;

export const Icons = () => (
  <div className='mx-auto flex w-full max-w-[800px] flex-wrap justify-center gap-4'>
    {Object.keys(icons).map((key) => (
      <div key={key} data-tooltip-id={key} className='flex w-max flex-col items-center gap-2'>
        {createElement(icons[key as keyof typeof icons], {
          className: 'size-[36px]',
        })}
        <span className='w-[100px] truncate text-center'>{key}</span>
        <Tooltip tooltipId={key} content={key} />
      </div>
    ))}
  </div>
);
