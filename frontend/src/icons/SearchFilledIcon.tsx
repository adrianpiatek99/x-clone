import * as React from 'react';
import { SVGProps, Ref, forwardRef } from 'react';
const SvgSearchFilledIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d='M11 2a9 9 0 1 0 5.618 16.032l3.675 3.675a1 1 0 0 0 1.414-1.414l-3.675-3.675A9 9 0 0 0 11 2m-6 9a6 6 0 1 1 12 0 6 6 0 0 1-12 0'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgSearchFilledIcon);
export default ForwardRef;
