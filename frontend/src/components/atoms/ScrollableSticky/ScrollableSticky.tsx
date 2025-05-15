import type { ComponentProps } from 'react';

import type { StickyBoxConfig } from './useScrollableSticky';
import { useScrollableSticky } from './useScrollableSticky';

type Props = StickyBoxConfig & Pick<ComponentProps<'div'>, 'children' | 'className' | 'style'>;

const ScrollableSticky = ({ offsetTop = 12, offsetBottom = 12, bottom, ...props }: Props) => {
  const ref = useScrollableSticky({ offsetTop, offsetBottom, bottom });

  return <div style={{ position: 'sticky', top: `${offsetTop}px` }} {...props} ref={ref} />;
};

export default ScrollableSticky;
