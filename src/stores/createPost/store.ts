import { VALIDATION } from '@/constants/validation';
import { create } from 'zustand';

import type { CreatePostState } from './types';
import type { CreatePostStore } from './types';

export const initialState: CreatePostState = {
  text: '',
  files: [],
  modal: {
    isOpen: false,
    text: '',
    files: [],
  },
};

export const useCreatePostStore = create<CreatePostStore>((set) => ({
  ...initialState,
  update: (payload) => set((state) => ({ ...state, ...payload })),
  addFiles: (files) => {
    const newFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    set((state) => ({
      files: [...state.files, ...newFiles].slice(0, VALIDATION.POST.MEDIA.LIMIT),
    }));
  },
  removeFile: (filePreview) => {
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
        ].slice(0, VALIDATION.POST.MEDIA.LIMIT),
      },
    })),
  removeModalFile: (filePreview) => {
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
