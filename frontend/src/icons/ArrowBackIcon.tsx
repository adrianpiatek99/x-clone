import * as React from 'react';
import { SVGProps, Ref, forwardRef } from 'react';
const SvgArrowBackIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    height='1em'
    viewBox='0 -960 960 960'
    width='1em'
    fill='currentColor'
    ref={ref}
    {...props}
  >
    <path d='m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z' />
  </svg>
);
const ForwardRef = forwardRef(SvgArrowBackIcon);
export default ForwardRef;
