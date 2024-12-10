import * as React from 'react';
import { SVGProps, Ref, forwardRef } from 'react';
const SvgUserUnfollowIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg viewBox='0 0 24 24' fill='currentColor' height='1em' width='1em' ref={ref} {...props}>
    <path fill='none' d='M0 0h24v24H0z' />
    <path d='M14 14.252v2.09A6 6 0 0 0 6 22l-2-.001a8 8 0 0 1 10-7.748zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm7 6.586 2.121-2.122 1.415 1.415L20.414 19l2.122 2.121-1.415 1.415L19 20.414l-2.121 2.122-1.415-1.415L17.586 19l-2.122-2.121 1.415-1.415L19 17.586z' />
  </svg>
);
const ForwardRef = forwardRef(SvgUserUnfollowIcon);
export default ForwardRef;
