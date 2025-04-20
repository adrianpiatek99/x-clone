import { create } from 'zustand';

import type { VirtualScrollState, VirtualScrollStore } from './types';

export const initialState: VirtualScrollState = {
  states: {},
};

export const useVirtualScrollStore = create<VirtualScrollStore>((set, get) => ({
  ...initialState,
  update: (key, state) =>
    set((store) => ({
      states: { ...store.states, [key]: state },
    })),
  getState: (key) => get().states[key],
  resetStore: (key) =>
    set((store) => {
      const { [key]: _, ...rest } = store.states;

      return { states: rest };
    }),
}));
