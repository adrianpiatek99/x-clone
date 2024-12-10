import * as React from 'react';
import { SVGProps, Ref, forwardRef } from 'react';
const SvgPeopleIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg fill='currentColor' viewBox='0 0 16 16' height='1em' width='1em' ref={ref} {...props}>
    <path d='M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z' />
  </svg>
);
const ForwardRef = forwardRef(SvgPeopleIcon);
export default ForwardRef;
