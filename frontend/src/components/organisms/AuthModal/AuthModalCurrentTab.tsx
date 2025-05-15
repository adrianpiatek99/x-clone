import React from 'react';

import { useAuthStore } from '@/stores/auth';

import AuthModalLoginForm from './AuthModalLoginForm';
import AuthModalRegisterForm from './AuthModalRegisterForm';

export const AuthModalCurrentTab = () => {
  const currentTab = useAuthStore((state) => state.currentTab);

  if (currentTab === 'register') {
    return <AuthModalRegisterForm />;
  }

  return <AuthModalLoginForm />;
};
