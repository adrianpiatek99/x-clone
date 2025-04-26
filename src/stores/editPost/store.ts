import { VALIDATION } from '@/constants/validation';
import { create } from 'zustand';

import type { EditPostState, EditPostStore } from './types';

export const initialState = {
  files: [],
} satisfies EditPostState;

export const useEditPostStore = create<EditPostStore>((set) => ({
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
  resetStore: () => set((state) => ({ ...state, ...initialState })),
}));
