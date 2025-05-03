'use client';

import type { ComponentPropsWithoutRef, FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import type { Height } from 'react-animate-height';
import AnimateHeight from 'react-animate-height';

const DEFAULT_DURATION = 200;

type AutoHeightProps = Omit<ComponentPropsWithoutRef<typeof AnimateHeight>, 'height'>;

const AutoHeight: FC<AutoHeightProps> = ({ children, ...props }) => {
  const [height, setHeight] = useState<Height>('auto');
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (contentRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        setHeight(contentRef.current?.clientHeight ?? 'auto');
      });

      resizeObserver.observe(contentRef.current);

      return () => resizeObserver.disconnect();
    }
  }, []);

  return (
    <AnimateHeight
      duration={DEFAULT_DURATION}
      {...props}
      height={height}
      contentClassName='auto-content'
      contentRef={contentRef}
    >
      {children}
    </AnimateHeight>
  );
};

export default AutoHeight;
