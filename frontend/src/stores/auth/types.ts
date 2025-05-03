export type AuthTab = 'signIn' | 'signUp';

export type AuthState = {
  currentTab: AuthTab;
  isModalOpen: boolean;
};

export type AuthActions = {
  update: (payload: Partial<AuthState>) => void;
  resetStore: () => void;
};

export type AuthStore = AuthState & AuthActions;
