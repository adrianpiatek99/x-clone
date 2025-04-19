import { create } from 'zustand';

import type { HomeState, HomeStore } from './types';

export const initialState: HomeState = {
  currentTab: null,
  enableTrackNewPosts: false,
};

export const useHomeStore = create<HomeStore>((set) => ({
  ...initialState,
  update: (payload) => set((state) => ({ ...state, ...payload })),
  resetStore: () => set(initialState),
}));
