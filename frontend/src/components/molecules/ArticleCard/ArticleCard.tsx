import type { ComponentPropsWithRef, PropsWithChildren, Ref } from 'react';
import React, { memo } from 'react';

import Box from '@/components/atoms/Box';
import { useSyntheticEvents } from '@/hooks/useSyntheticEvents';
import { twMerge } from 'tailwind-merge';

type Props = ComponentPropsWithRef<'div'> & {
  isLoading?: boolean;
  href?: string;
  ref?: Ref<HTMLDivElement | null>;
};

const ArticleCard = memo(
  ({ children, className, href, isLoading = false, ...props }: PropsWithChildren<Props>) => {
    const { handleOnClick, handleOnKeyUp, handleOnMouseUp } = useSyntheticEvents({
      href: href ?? '',
    });

    return (
      <Box
        as='article'
        className={twMerge(
          'cursor-pointer px-4 py-3 outline-none transition duration-200 focus-visible:bg-text-1/10 ring-inset focus-visible:ring-focus focus-visible:ring-2',
          isLoading ? 'pointer-events-none' : 'hover:bg-text-1/5',
          className
        )}
        {...props}
        onClick={(e) => href && handleOnClick(e)}
        onKeyUp={(e) => href && handleOnKeyUp(e)}
        onMouseUp={(e) => href && handleOnMouseUp(e)}
        tabIndex={0}
        data-navigable='true'
      >
        {children}
      </Box>
    );
  }
);

export default ArticleCard;
