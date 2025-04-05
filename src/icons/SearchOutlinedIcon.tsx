import * as React from 'react';
import { SVGProps, Ref, forwardRef } from 'react';
const SvgSearchOutlinedIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    width='1em'
    height='1em'
    ref={ref}
    {...props}
  >
    <path
      fill='none'
      stroke='currentColor'
      d='m21 21-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgSearchOutlinedIcon);
export default ForwardRef;
