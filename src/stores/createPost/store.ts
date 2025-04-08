import { POST_MEDIA_LIMIT } from '@/db/constants';
import { create } from 'zustand';

import type { CreatePostState } from './types';
import type { CreatePostStore } from './types';

export const initialState: CreatePostState = {
  text: '',
  files: [],
  aspectRatio: 0,
};

export const useCreatePostStore = create<CreatePostStore>((set, get) => ({
  ...initialState,
  update: (payload) => set((state) => ({ ...state, ...payload })),
  addFiles: (files) =>
    set((state) => ({
      files: [
        ...state.files,
        ...files.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        })),
      ].slice(0, POST_MEDIA_LIMIT),
    })),
  removeFile: (filePreview) => {
    const files = get().files;

    if (files.length === 1) {
      set({ aspectRatio: 0 });
    }

    set((state) => ({
      files: state.files.filter((file) => file.preview !== filePreview),
    }));
  },
  resetStore: () => set(initialState),
}));
