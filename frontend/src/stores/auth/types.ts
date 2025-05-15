export type AuthTab = 'login' | 'register';

export type AuthState = {
  currentTab: AuthTab;
  isModalOpen: boolean;
};

export type AuthActions = {
  update: (payload: Partial<AuthState>) => void;
  resetStore: () => void;
};

export type AuthStore = AuthState & AuthActions;
