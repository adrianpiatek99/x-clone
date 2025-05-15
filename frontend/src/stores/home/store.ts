import { create } from 'zustand';

import type { HomeState, HomeStore } from './types';

export const initialState = {
  currentTab: null,
  global: {
    enableTrackTimeline: false,
  },
} satisfies HomeState;

export const useHomeStore = create<HomeStore>((set) => ({
  ...initialState,
  update: (payload) => set((state) => ({ ...state, ...payload })),
  updateGlobal: (payload) =>
    set((state) => ({ ...state, global: { ...state.global, ...payload } })),
  resetStore: () => set(initialState),
}));
