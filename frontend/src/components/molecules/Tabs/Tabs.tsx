import type { ReactNode } from 'react';
import React, {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { debounce } from '@/utils/debounce';

import type { TabProps } from './Tab';

const TAB_INDICATOR_PADDING = 24;

type TabChildProps = { value?: string };

type TabsIndicatorPosition = {
  left: number;
  width: number;
};

export type TabsProps<TValue> = {
  children: ReactNode;
  value: TValue;
  onChange?: (tab: TValue) => void;
};

const Tabs = <TValue,>({ children, value, onChange }: TabsProps<TValue>) => {
  const tabGroupRef = useRef<HTMLDivElement>(null);
  const [indicatorPosition, setIndicatorPosition] = useState<TabsIndicatorPosition>({
    left: 0,
    width: 0,
  });

  const childrenWithProps = useMemo(
    () =>
      Children.map(children, (child) => {
        if (isValidElement(child)) {
          const childValue = (child.props as TabChildProps).value;
          const selected = childValue === value;

          return cloneElement(child, {
            selected,
            onClick: () => onChange?.(childValue as TValue),
          } as TabProps<TValue>);
        }

        return null;
      }),
    [children, value, onChange]
  );

  useEffect(() => {
    const current = tabGroupRef.current;

    if (current) {
      const calcIndicatorListener = () => {
        const selectedTabElement = current.querySelector(
          '[aria-selected="true"]'
        ) as HTMLElement | null;

        if (selectedTabElement) {
          const tabRect = selectedTabElement.getBoundingClientRect();
          const containerRect = current.getBoundingClientRect();
          const left = tabRect.left - containerRect.left;
          const tabInnerElement = selectedTabElement.querySelector('span');
          const innerRect = tabInnerElement?.getBoundingClientRect();

          if (innerRect) {
            selectedTabElement.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'center',
            });

            setIndicatorPosition({
              left: left + (innerRect.left - tabRect.left) - TAB_INDICATOR_PADDING / 2,
              width: innerRect.width + TAB_INDICATOR_PADDING,
            });
          }
        }
      };

      const debouncedCalc = debounce(calcIndicatorListener, 250);

      calcIndicatorListener();

      window.addEventListener('resize', debouncedCalc);

      return () => window.removeEventListener('resize', debouncedCalc);
    }
  }, [value]);

  return (
    <div className='flex h-[53px] shrink-0 overflow-hidden border-b border-border-1'>
      <div className='hide-scrollbar relative flex grow overflow-x-auto overflow-y-hidden whitespace-nowrap'>
        <div
          ref={tabGroupRef}
          className='relative flex w-full'
          role='tablist'
          aria-labelledby='tabs'
        >
          {childrenWithProps}
        </div>
        {!!indicatorPosition.width && (
          <span
            className='absolute bottom-0 flex h-[3px] w-[70px] rounded-md bg-primary delay-[width] duration-200'
            style={{
              width: `${indicatorPosition.width}px`,
              left: `${indicatorPosition.left}px`,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Tabs;
