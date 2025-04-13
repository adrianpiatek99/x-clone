export enum HomeTab {
  GLOBAL = 'global',
  FOLLOWING = 'following',
}

export type HomeState = {
  currentTab: HomeTab | null;
};

export type HomeActions = {
  update: (payload: Partial<HomeState>) => void;
  resetStore: () => void;
};

export type HomeStore = HomeState & HomeActions;
