'use client';

import type { ReactElement, Ref } from 'react';
import React, { cloneElement, useState } from 'react';

import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { twMerge } from 'tailwind-merge';

type Props = {
  children: ReactElement<{ ref?: Ref<HTMLElement> }>;
  content?: ReactElement | string;
};

const Tooltip = ({ children, content }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(4), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    move: false,
    delay: {
      open: 300,
      close: 100,
    },
  });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, {
    role: 'tooltip',
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

  if (!content) return children;

  return (
    <>
      {cloneElement(children, {
        ref: refs.setReference,
        ...getReferenceProps(),
      })}
      <FloatingPortal>
        <div
          ref={refs.setFloating}
          className={twMerge(
            'z-[999] rounded-[4px] bg-tooltip px-2 py-1 transition-opacity duration-200 ease-out [color:#fff] [font-size:12px] [line-height:12px]',
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          {content}
        </div>
      </FloatingPortal>
    </>
  );
};

export default Tooltip;
