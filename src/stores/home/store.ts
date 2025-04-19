import { create } from 'zustand';

import type { HomeState, HomeStore } from './types';

export const initialState: HomeState = {
  currentTab: null,
  global: {
    enableTrackNewPosts: false,
  },
};

export const useHomeStore = create<HomeStore>((set) => ({
  ...initialState,
  update: (payload) => set((state) => ({ ...state, ...payload })),
  updateGlobal: (payload) =>
    set((state) => ({ ...state, global: { ...state.global, ...payload } })),
  resetStore: () => set(initialState),
}));
