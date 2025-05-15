import type { PostMedia } from '@/types/post';

export type EditPostState = {
  files: { media?: PostMedia; file?: File; preview: string }[];
};

export type EditPostActions = {
  update: (payload: Partial<EditPostState>) => void;
  addFiles: (files: File[]) => void;
  removeFile: (filePreview: string) => void;
  resetStore: () => void;
};

export type EditPostStore = EditPostState & EditPostActions;
