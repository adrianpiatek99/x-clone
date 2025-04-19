export enum HomeTab {
  GLOBAL = 'global',
  FOLLOWING = 'following',
}

export type HomeState = {
  currentTab: HomeTab | null;
  global: {
    enableTrackNewPosts: boolean;
  };
};

export type HomeActions = {
  update: (payload: Partial<HomeState>) => void;
  updateGlobal: (payload: Partial<HomeState['global']>) => void;
  resetStore: () => void;
};

export type HomeStore = HomeState & HomeActions;
