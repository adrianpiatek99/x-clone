import * as React from 'react';
import { SVGProps, Ref, forwardRef } from 'react';
const SvgCalendarIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg viewBox='0 0 24 24' fill='currentColor' height='1em' width='1em' ref={ref} {...props}>
    <path d='M7 11h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z' />
    <path d='M5 22h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2zM19 8l.001 12H5V8h14z' />
  </svg>
);
const ForwardRef = forwardRef(SvgCalendarIcon);
export default ForwardRef;
