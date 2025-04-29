import type { VirtualItem } from '@tanstack/react-virtual';

export enum VirtualScrollKeys {
  GLOBAL_TIMELINE = 'GLOBAL_TIMELINE',
  FOLLOWING_TIMELINE = 'FOLLOWING_TIMELINE',
  USER_POSTS = 'USER_POSTS',
  USER_LIKES = 'USER_LIKES',
}

type VirtualScroll = {
  offset: number;
  cache: VirtualItem[];
};

export type VirtualScrollState = {
  states: Partial<Record<VirtualScrollKeys, VirtualScroll>>;
};

type VirtualScrollActions = {
  getState: (key: VirtualScrollKeys) => VirtualScroll | undefined;
  update: (payload: string, state: VirtualScroll) => void;
  resetStore: () => void;
};

export type VirtualScrollStore = VirtualScrollState & VirtualScrollActions;
