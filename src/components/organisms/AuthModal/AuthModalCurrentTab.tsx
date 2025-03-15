import React from 'react';

import { useAuthStore } from '@/stores/auth';

import AuthModalSignInForm from './AuthModalSignInForm';
import AuthModalSignUpForm from './AuthModalSignUpForm';

export const AuthModalCurrentTab = () => {
  const currentTab = useAuthStore((state) => state.currentTab);

  if (currentTab === 'signUp') {
    return <AuthModalSignUpForm />;
  }

  return <AuthModalSignInForm />;
};
