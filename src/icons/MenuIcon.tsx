import * as React from 'react';
import { SVGProps, Ref, forwardRef } from 'react';
const SvgMenuIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    height='1em'
    viewBox='0 -960 960 960'
    width='1em'
    fill='currentColor'
    ref={ref}
    {...props}
  >
    <path
      d='M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z'
      stroke='currentColor'
      strokeWidth={2}
    />
  </svg>
);
const ForwardRef = forwardRef(SvgMenuIcon);
export default ForwardRef;
