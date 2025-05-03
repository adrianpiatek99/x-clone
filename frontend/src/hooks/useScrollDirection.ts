import { useEffect, useState } from 'react';

export enum ScrollDirection {
  UP,
  DOWN,
}

export const useScrollDirection = (offset = 10) => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection | null>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? ScrollDirection.DOWN : ScrollDirection.UP;

      if (
        direction !== scrollDirection &&
        (scrollY - lastScrollY > offset || scrollY - lastScrollY < -offset)
      ) {
        setScrollDirection(direction);
      }

      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener('scroll', updateScrollDirection);

    return () => {
      window.removeEventListener('scroll', updateScrollDirection);
    };
  }, [scrollDirection, offset]);

  return scrollDirection;
};
