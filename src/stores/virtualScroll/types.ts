import type { VirtualItem } from '@tanstack/react-virtual';

type VirtualScroll = {
  offset: number;
  cache: VirtualItem[];
};

export type VirtualScrollState = {
  states: Record<string, VirtualScroll>;
};

type VirtualScrollActions = {
  getState: (key: string) => VirtualScroll | undefined;
  update: (key: string, state: VirtualScroll) => void;
  resetStore: (key: string) => void;
};

export type VirtualScrollStore = VirtualScrollState & VirtualScrollActions;
