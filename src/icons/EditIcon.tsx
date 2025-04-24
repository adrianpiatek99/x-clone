import * as React from 'react';
import { SVGProps, Ref, forwardRef } from 'react';
const SvgEditIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    width='1em'
    height='1em'
    ref={ref}
    {...props}
  >
    <path
      fill='currentColor'
      d='M18.58 2.944a2 2 0 0 0-2.828 0L14.107 4.59l5.303 5.303 1.645-1.644a2 2 0 0 0 0-2.829zm-.584 8.363-5.303-5.303-8.835 8.835-1.076 6.38 6.38-1.077z'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgEditIcon);
export default ForwardRef;
