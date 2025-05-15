import { useEffect, useRef } from 'react';

type IntersectionObserverOptions = {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
};

type Props = {
  callback: (entry: IntersectionObserverEntry) => void;
  options?: IntersectionObserverOptions;
};

export const useIntersectionObserver = ({ callback, options = {} }: Props) => {
  const observer = useRef<IntersectionObserver>(null!);

  const observeElement = (node: Element | null) => {
    if (!node || !window.IntersectionObserver) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver((entries) => {
      if (entries?.[0]) {
        callback(entries[0]);
      }
    }, options);

    observer.current.observe(node);
  };

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return { observeElement };
};
