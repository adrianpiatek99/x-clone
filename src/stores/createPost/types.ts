export type CreatePostState = {
  text: string;
  files: { file: File; preview: string }[];
  modal: {
    isOpen: boolean;
    text: string;
    files: { file: File; preview: string }[];
  };
};

export type CreatePostActions = {
  update: (payload: Partial<CreatePostState>) => void;
  addFiles: (files: File[]) => void;
  removeFile: (filePreview: string) => void;
  updateModal: (payload: Partial<CreatePostState['modal']>) => void;
  addModalFiles: (files: File[]) => void;
  removeModalFile: (filePreview: string) => void;
  resetModalStore: () => void;
  resetStore: () => void;
};

export type CreatePostStore = CreatePostState & CreatePostActions;
