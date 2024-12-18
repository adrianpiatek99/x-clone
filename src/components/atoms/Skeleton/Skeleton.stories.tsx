import type { Meta, StoryFn } from '@storybook/react';

import type { SkeletonProps } from '.';
import { Skeleton } from '.';

const meta = {
  title: 'Components / Atoms / Skeleton',
  component: Skeleton,
  decorators: [(Story) => <div className='flex w-full max-w-[600px]'>{Story()}</div>],
} satisfies Meta<SkeletonProps>;

export default meta;

const Template: StoryFn<SkeletonProps> = (args) => <Skeleton {...args} />;

export const Playground = Template.bind({});

Playground.args = {
  width: 250,
  height: 50,
  variant: 'circular',
  withoutRadius: false,
};

export const PostSkeleton = () => (
  <div className='flex grow flex-row gap-3 px-4 py-3'>
    <div className='flex grow flex-row gap-3'>
      <Skeleton width={48} height={48} variant='circular' />
      <div className='mt-0.5 flex grow flex-col gap-1.5'>
        <Skeleton width={200} height={15} />
        <div className='flex flex-col gap-1'>
          <Skeleton height={15} />
          <Skeleton height={15} />
          <Skeleton width={175} height={15} />
        </div>
        <div className='relative mt-1.5 flex gap-3 pb-[56.25%]'>
          <Skeleton absolute />
        </div>
        <div className='mt-1.5 flex max-w-[425px] flex-row gap-6 px-2.5 py-1'>
          <Skeleton height={15} width={54} />
          <Skeleton height={15} width={54} />
          <Skeleton height={15} width={54} />
        </div>
      </div>
    </div>
  </div>
);
