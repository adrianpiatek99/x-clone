import { create } from 'zustand';

import type { EditProfileState, EditProfileStore } from './types';

export const initialState: EditProfileState = {
  avatar: {
    file: null,
    url: '',
  },
  banner: {
    file: null,
    url: '',
  },
  isUploadFileLoading: false,
};

export const useEditProfileStore = create<EditProfileStore>((set) => ({
  ...initialState,
  update: (payload) => set((state) => ({ ...state, ...payload })),
  updateInitialState: (avatarUrl, bannerUrl) =>
    set((state) => ({
      avatar: { ...state.avatar, url: avatarUrl },
      banner: { ...state.banner, url: bannerUrl },
    })),
  updateAvatarFile: (file) =>
    set({ avatar: { file: file ?? null, url: file ? URL.createObjectURL(file) : '' } }),
  updateBannerFile: (file) =>
    set({ banner: { file: file ?? null, url: file ? URL.createObjectURL(file) : '' } }),
  resetStore: () => set(initialState),
}));
