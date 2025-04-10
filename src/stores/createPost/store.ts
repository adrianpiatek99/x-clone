import { POST_MEDIA_LIMIT } from '@/db/constants';
import { create } from 'zustand';

import type { CreatePostState } from './types';
import type { CreatePostStore } from './types';

export const initialState: CreatePostState = {
  text: '',
  files: [],
  aspectRatio: 0,
  modal: {
    isOpen: false,
    text: '',
    files: [],
    aspectRatio: 0,
  },
};

export const useCreatePostStore = create<CreatePostStore>((set, get) => ({
  ...initialState,
  update: (payload) => set((state) => ({ ...state, ...payload })),
  addFiles: (files) => {
    const newFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    set((state) => ({
      files: [...state.files, ...newFiles].slice(0, POST_MEDIA_LIMIT),
    }));
  },
  removeFile: (filePreview) => {
    const files = get().files;

    if (files.length === 1) {
      set({ aspectRatio: 0 });
    }

    set((state) => ({
      files: state.files.filter((file) => file.preview !== filePreview),
    }));
  },
  updateModal: (payload) => set((state) => ({ ...state, modal: { ...state.modal, ...payload } })),
  addModalFiles: (files) =>
    set((state) => ({
      modal: {
        ...state.modal,
        files: [
          ...state.modal.files,
          ...files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
          })),
        ].slice(0, POST_MEDIA_LIMIT),
      },
    })),
  removeModalFile: (filePreview) => {
    const files = get().modal.files;

    if (files.length === 1) {
      set({ modal: { ...get().modal, aspectRatio: 0 } });
    }

    set((state) => ({
      modal: {
        ...state.modal,
        files: state.modal.files.filter((file) => file.preview !== filePreview),
      },
    }));
  },
  resetModalStore: () => set((state) => ({ ...state, modal: initialState.modal })),
  resetStore: () =>
    set((state) => ({
      ...initialState,
      modal: state.modal,
    })),
}));
