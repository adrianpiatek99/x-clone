import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';

import dynamic from 'next/dynamic';

const LazyPillNotifyRefreshing = dynamic(
  () => import('@/components/molecules/PillNotify').then((mod) => mod.PillNotifyRefreshing),
  {
    ssr: false,
  }
);

type Props = {
  isRefetching: boolean;
  additionalPillNotify?: ReactNode;
};

export const FlatListPillNotify = ({ isRefetching, additionalPillNotify }: Props) => {
  const [headerBarHeight, setHeaderBarHeight] = useState(0);

  useEffect(() => {
    const headerBar = document.getElementById('header-bar');

    if (headerBar) {
      setHeaderBarHeight(headerBar.offsetHeight);
    }
  }, []);

  return (
    <div style={{ top: headerBarHeight }} className='sticky z-[5]'>
      <LazyPillNotifyRefreshing isRefetching={isRefetching} />
      {additionalPillNotify}
    </div>
  );
};
