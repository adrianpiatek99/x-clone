'use client';

import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useMemo, useRef } from 'react';

import type { AuthUser } from '@/types/user';

type AuthContextType = {
  user: AuthUser | undefined;
  setUser: (user: AuthUser | undefined) => void;
};

type AuthProviderProps = {
  authUser: AuthUser | undefined;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children, authUser }: PropsWithChildren<AuthProviderProps>) => {
  const userRef = useRef<AuthUser | undefined>(authUser);

  const setUser = useCallback((user: AuthUser | undefined) => {
    userRef.current = user;
  }, []);

  const value = useMemo(
    () => ({
      get user() {
        return userRef.current;
      },
      setUser,
    }),
    [setUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return ctx;
};
