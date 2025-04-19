import { lazy } from 'react';

export { default } from './PillNotify';

export const LazyPillNotifyRefreshing = lazy(() =>
  import('./PillNotifyRefreshing').then((mod) => ({ default: mod.PillNotifyRefreshing }))
);
