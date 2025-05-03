import * as React from 'react';
import { SVGProps, Ref, forwardRef } from 'react';
const SvgPlayIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    fill='currentColor'
    width='1em'
    height='1em'
    viewBox='0 0 60 67'
    xmlns='http://www.w3.org/2000/svg'
    ref={ref}
    {...props}
  >
    <path d='M5.976 66.314a6.7 6.7 0 0 0 2.417-.439 15.179 15.179 0 0 0 2.368-1.172L54.707 39.41c1.79-1.041 3.027-1.961 3.71-2.759.684-.797 1.026-1.75 1.026-2.856 0-1.107-.342-2.059-1.026-2.857-.683-.797-1.92-1.717-3.71-2.758L10.76 2.887a15.179 15.179 0 0 0-2.368-1.172 6.7 6.7 0 0 0-2.417-.44c-1.53 0-2.742.546-3.638 1.636C1.443 4.001.996 5.458.996 7.281V60.31c0 1.822.447 3.28 1.342 4.37.896 1.09 2.108 1.635 3.638 1.635Z' />
  </svg>
);
const ForwardRef = forwardRef(SvgPlayIcon);
export default ForwardRef;
