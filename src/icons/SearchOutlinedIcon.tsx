import * as React from 'react';
import { SVGProps, Ref, forwardRef } from 'react';
const SvgSearchOutlinedIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg viewBox='0 0 1024 1024' fill='currentColor' height='1em' width='1em' ref={ref} {...props}>
    <path d='M887 840.4 673.4 624.8c41.8-52.4 67-118.8 67-191 0-169-137-306-306.2-306S128 265 128 434s137 306 306.2 306c73.2 0 140.2-25.6 193-68.4l212.2 214.2c6.4 6.8 15.2 10.2 23.8 10.2 8.2 0 16.4-3 22.6-9 13.2-12.6 13.6-33.4 1.2-46.6zM434.2 674.2c-64.2 0-124.6-25-170-70.4-45.4-45.4-70.4-105.8-70.4-169.8 0-64.2 25-124.6 70.4-169.8 45.4-45.4 105.8-70.4 170-70.4s124.6 25 170 70.4c45.4 45.4 70.4 105.8 70.4 169.8 0 64.2-25 124.6-70.4 169.8-45.4 45.4-105.8 70.4-170 70.4z' />
  </svg>
);
const ForwardRef = forwardRef(SvgSearchOutlinedIcon);
export default ForwardRef;
