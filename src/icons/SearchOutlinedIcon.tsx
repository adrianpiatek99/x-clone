import * as React from 'react';
import { SVGProps, Ref, forwardRef } from 'react';
const SvgSearchOutlinedIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg viewBox='0 0 24 24' fill='currentColor' height='1em' width='1em' ref={ref} {...props}>
    <path fill='none' d='M0 0h24v24H0z' />
    <path d='m18.031 16.617 4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z' />
  </svg>
);
const ForwardRef = forwardRef(SvgSearchOutlinedIcon);
export default ForwardRef;
