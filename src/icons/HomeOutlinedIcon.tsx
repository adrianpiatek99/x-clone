import * as React from 'react';
import { SVGProps, Ref, forwardRef } from 'react';
const SvgHomeOutlinedIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg width='1em' height='1em' viewBox='0 0 24 24' fill='none' ref={ref} {...props}>
    <path
      d='M10.07 2.82 3.14 8.37c-.78.62-1.28 1.93-1.11 2.91l1.33 7.96c.24 1.42 1.6 2.57 3.04 2.57h11.2c1.43 0 2.8-1.16 3.04-2.57l1.33-7.96c.16-.98-.34-2.29-1.11-2.91l-6.93-5.54c-1.07-.86-2.8-.86-3.86-.01Z'
      stroke='currentColor'
      strokeWidth={1.5}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M12 15.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z'
      stroke='currentColor'
      strokeWidth={1.5}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgHomeOutlinedIcon);
export default ForwardRef;