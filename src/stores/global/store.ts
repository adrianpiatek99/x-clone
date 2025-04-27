import { create } from 'zustand';

import type { GlobalState, GlobalStore } from './types';

export const initialState = {
  mobileDrawer: {
    isOpen: false,
  },
  logoutModal: {
    isOpen: false,
  },
  authRequiredModal: {
    isOpen: false,
  },
  previousPathname: null,
} satisfies GlobalState;

export const useGlobalStore = create<GlobalStore>((set) => ({
  ...initialState,
  update: (payload) => set((state) => ({ ...state, ...payload })),
  updateMobileDrawer: (payload) =>
    set((state) => ({ ...state, mobileDrawer: { ...state.mobileDrawer, ...payload } })),
  updateLogoutModal: (payload) =>
    set((state) => ({ ...state, logoutModal: { ...state.logoutModal, ...payload } })),
  updateAuthRequiredModal: (payload) =>
    set((state) => ({ ...state, authRequiredModal: { ...state.authRequiredModal, ...payload } })),
  resetStore: () => set(initialState),
}));
