import type { ReactNode } from 'react';
import React from 'react';

import ErrorState from '@/components/atoms/ErrorState';
import Loader from '@/components/atoms/Loader';

type Props = {
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
  children: ReactNode;
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
};

/**
 * A component that handles loading, error, and refetching states for data.
 * It displays a loading indicator, error state, or the actual content based on the current state.
 */
const DataState = ({
  isLoading,
  isError,
  onRetry,
  children,
  loadingComponent,
  errorComponent,
}: Props) => {
  if (isLoading) return loadingComponent || <Loader center />;

  if (isError) return errorComponent || <ErrorState onRetry={onRetry} />;

  return <div className='relative flex flex-col'>{children}</div>;
};

export default DataState;
