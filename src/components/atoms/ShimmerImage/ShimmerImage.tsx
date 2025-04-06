import React from 'react';

import type { ImageProps } from 'next/image';
import Image from 'next/image';

import { shimmerSvg } from './config';

type Props = ImageProps & {
  alt: string;
};

const toBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);

export const ShimmerImage = ({ alt, ...props }: Props) => {
  return (
    <Image
      {...props}
      alt={alt}
      fill
      placeholder='blur'
      blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmerSvg())}`}
    />
  );
};
