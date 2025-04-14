export type GlobalState = {
  mobileDrawer: {
    isOpen: boolean;
  };
  logoutModal: {
    isOpen: boolean;
  };
  authRequiredModal: {
    isOpen: boolean;
  };
};

export type GlobalActions = {
  update: (payload: Partial<GlobalState>) => void;
  updateMobileDrawer: (payload: Partial<GlobalState['mobileDrawer']>) => void;
  updateLogoutModal: (payload: Partial<GlobalState['logoutModal']>) => void;
  updateAuthRequiredModal: (payload: Partial<GlobalState['authRequiredModal']>) => void;
  resetStore: () => void;
};

export type GlobalStore = GlobalState & GlobalActions;
