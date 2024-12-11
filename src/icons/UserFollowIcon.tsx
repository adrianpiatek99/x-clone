import * as React from 'react';
import { SVGProps, Ref, forwardRef } from 'react';
const SvgUserFollowIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg viewBox='0 0 24 24' fill='currentColor' height='1em' width='1em' ref={ref} {...props}>
    <path fill='none' d='M0 0h24v24H0z' />
    <path d='M14 14.252v2.09A6 6 0 0 0 6 22l-2-.001a8 8 0 0 1 10-7.748zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm5.793 8.914 3.535-3.535 1.415 1.414-4.95 4.95-3.536-3.536 1.415-1.414 2.12 2.121z' />
  </svg>
);
const ForwardRef = forwardRef(SvgUserFollowIcon);
export default ForwardRef;