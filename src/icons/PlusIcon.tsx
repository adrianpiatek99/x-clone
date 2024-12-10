import * as React from 'react';
import { SVGProps, Ref, forwardRef } from 'react';
const SvgPlusIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg fill='currentColor' viewBox='0 0 16 16' height='1em' width='1em' ref={ref} {...props}>
    <path d='M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z' />
  </svg>
);
const ForwardRef = forwardRef(SvgPlusIcon);
export default ForwardRef;
