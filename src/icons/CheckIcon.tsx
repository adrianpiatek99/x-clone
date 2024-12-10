import * as React from 'react';
import { SVGProps, Ref, forwardRef } from 'react';
const SvgCheckIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    width='1em'
    height='1em'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    ref={ref}
    {...props}
  >
    <path d='M20 6 9 17l-5-5' />
  </svg>
);
const ForwardRef = forwardRef(SvgCheckIcon);
export default ForwardRef;
