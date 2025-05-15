import { create } from 'zustand';

import type { VirtualScrollState, VirtualScrollStore } from './types';

export const initialState = {
  states: {},
} satisfies VirtualScrollState;

export const useVirtualScrollStore = create<VirtualScrollStore>((set, get) => ({
  ...initialState,
  update: (key, state) =>
    set((store) => ({
      states: { ...store.states, [key]: state },
    })),
  getState: (key) => get().states[key],
  resetStore: () => set((state) => ({ ...state, ...initialState })),
}));
