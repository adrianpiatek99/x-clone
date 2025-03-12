import { create } from 'zustand';

import type { AuthState, AuthStore } from './types';

export const initialState: AuthState = {
  currentTab: 'signIn',
  isModalOpen: false,
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,
  update: (payload) => set((state) => ({ ...state, ...payload })),
  resetStore: () => set(initialState),
}));
