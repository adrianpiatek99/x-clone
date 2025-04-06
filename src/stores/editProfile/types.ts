export type EditProfileState = {
  avatar: {
    file: File | null;
    url: string;
  };
  banner: {
    file: File | null;
    url: string;
  };
};

export type EditProfileActions = {
  updateInitialState: (avatarUrl: string, bannerUrl: string) => void;
  updateAvatarFile: (file: File | null) => void;
  updateBannerFile: (file: File | null) => void;
  update: (payload: Partial<EditProfileState>) => void;
  resetStore: () => void;
};

export type EditProfileStore = EditProfileState & EditProfileActions;
