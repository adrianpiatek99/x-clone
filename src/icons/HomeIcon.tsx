import * as React from 'react';
import { SVGProps, Ref, forwardRef } from 'react';
const SvgHomeIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg width='1em' height='1em' viewBox='0 0 24 24' fill='none' ref={ref} {...props}>
    <path
      d='m20.86 8.37-6.93-5.54c-1.07-.86-2.8-.86-3.86-.01L3.14 8.37c-.78.62-1.28 1.93-1.11 2.91l1.33 7.96c.24 1.42 1.6 2.57 3.04 2.57h11.2c1.43 0 2.8-1.16 3.04-2.57l1.33-7.96c.16-.98-.34-2.29-1.11-2.91ZM12 15.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5Z'
      fill='currentColor'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgHomeIcon);
export default ForwardRef;
