import { create } from 'zustand';

import type { AuthState, AuthStore } from './types';

export const initialState = {
  currentTab: 'signIn',
  isModalOpen: false,
} satisfies AuthState;

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,
  update: (payload) => set((state) => ({ ...state, ...payload })),
  resetStore: () => set(initialState),
}));
