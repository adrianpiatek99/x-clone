import * as React from 'react';
import { SVGProps, Ref, forwardRef } from 'react';
const SvgVerifiedIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    fill='currentColor'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 50 50'
    width='1em'
    height='1em'
    ref={ref}
    {...props}
  >
    <path d='m45.103 24.995 3.195-6.245-5.892-3.807-.354-7.006-7.006-.35-3.81-5.89-6.242 3.2-6.245-3.196-3.806 5.893-7.005.354-.352 7.007-5.89 3.81 3.2 6.242-3.194 6.243 5.892 3.807.354 7.006 7.006.35 3.81 5.891 6.242-3.2 6.245 3.195 3.806-5.893 7.005-.354.352-7.006 5.89-3.81-3.201-6.241zM22.24 32.562l-6.82-6.819 2.121-2.121 4.732 4.731 10.202-9.888 2.088 2.154L22.24 32.562z' />
  </svg>
);
const ForwardRef = forwardRef(SvgVerifiedIcon);
export default ForwardRef;
