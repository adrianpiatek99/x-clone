'use client';

import type { PropsWithChildren } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { CurrentUser } from '@/types/user';

type AuthContextType = {
  user: CurrentUser | undefined;
  setUser: (user: CurrentUser | undefined) => void;
};

type AuthProviderProps = {
  currentUser: CurrentUser | undefined;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children, currentUser }: PropsWithChildren<AuthProviderProps>) => {
  const [user, setUserState] = useState<CurrentUser | undefined>(currentUser);
  const subscribersRef = useRef<Set<(user: CurrentUser | undefined) => void>>(new Set());

  const setUser = useCallback((newUser: CurrentUser | undefined) => {
    setUserState(newUser);
    subscribersRef.current.forEach((callback) => callback(newUser));
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
    }),
    [user, setUser]
  );

  useEffect(() => {
    const handleSessionUpdate = (event: CustomEvent<CurrentUser | null>) => {
      setUserState(event.detail || undefined);
    };

    document.addEventListener('sessionUpdate', handleSessionUpdate as EventListener);

    return () => {
      document.removeEventListener('sessionUpdate', handleSessionUpdate as EventListener);
    };
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const [currentUser, setCurrentUser] = useState<CurrentUser | undefined>(ctx.user);

  useEffect(() => {
    setCurrentUser(ctx.user);
  }, [ctx.user]);

  return {
    user: currentUser,
    setUser: ctx.setUser,
  };
};
