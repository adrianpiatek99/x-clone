'use client';

import type { PropsWithChildren } from 'react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { ScrollDirection, useScrollDirection } from '@/hooks/useScrollDirection';

type ScrollableStickyProps = {
  containerStickyTopGap?: number;
  containerStickyBottomGap?: number;
};

const ScrollableSticky = ({
  children,
  containerStickyTopGap = 12,
  containerStickyBottomGap = 60,
}: PropsWithChildren<ScrollableStickyProps>) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const scrollDirection = useScrollDirection(5);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const initElements = () => {
      if (!elementRef.current) return;

      const elementHeight = elementRef.current.offsetHeight;
      const heightDiff = Math.max(0, elementHeight - window.innerHeight);

      setContainerHeight(heightDiff);
      setShouldScroll(elementHeight > window.innerHeight);
    };

    initElements();

    window.addEventListener('scroll', initElements);
    window.addEventListener('resize', initElements);

    return () => {
      window.removeEventListener('scroll', initElements);
      window.removeEventListener('resize', initElements);
    };
  }, [shouldScroll, containerHeight, containerStickyTopGap, containerStickyBottomGap]);

  const height = useMemo(() => {
    const element = elementRef.current;

    if (!element) return '0px';

    const elementRect = element.getBoundingClientRect();

    if (scrollDirection === ScrollDirection.UP) {
      const topPosition = Math.abs(elementRect.top);

      if (topPosition >= containerHeight + containerStickyBottomGap) {
        return `${Math.max(0, window.scrollY - containerHeight - containerStickyBottomGap)}px`;
      }
    }

    return `${Math.max(0, window.scrollY - containerStickyTopGap)}px`;
  }, [scrollDirection, containerHeight, containerStickyTopGap, containerStickyBottomGap]);

  return (
    <>
      {shouldScroll && (
        <div
          style={{
            height,
          }}
        />
      )}
      <div
        ref={elementRef}
        className='sticky'
        style={
          shouldScroll
            ? {
                ...(scrollDirection === ScrollDirection.UP
                  ? { bottom: `-${containerHeight + containerStickyTopGap}px` }
                  : {
                      top: containerHeight
                        ? `-${containerHeight + containerStickyBottomGap}px`
                        : `${containerStickyTopGap}px`,
                    }),
              }
            : { top: `${containerStickyTopGap}px` }
        }
      >
        {children}
      </div>
    </>
  );
};

export default ScrollableSticky;
