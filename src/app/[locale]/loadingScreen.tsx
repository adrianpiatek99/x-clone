import type { ReactNode } from 'react';
import React from 'react';

import { Logo } from '@/components/atoms/Logo';
import { useAppSession } from '@/hooks/useAppSession';

const LoadingScreen = ({ children }: { children: ReactNode }) => {
  const { isLoading } = useAppSession();

  if (isLoading) {
    return (
      <div className='fixed inset-0 grid animate-logoAppear place-items-center bg-background'>
        <Logo className='[&>svg]:size-[64px]' />
      </div>
    );
  }

  return children;
};

export default LoadingScreen;
