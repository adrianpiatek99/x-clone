export type CreatePostState = {
  text: string;
  files: { file: File; preview: string }[];
  aspectRatio: number;
};

export type CreatePostActions = {
  update: (payload: Partial<CreatePostState>) => void;
  addFiles: (files: File[]) => void;
  removeFile: (filePreview: string) => void;
  resetStore: () => void;
};

export type CreatePostStore = CreatePostState & CreatePostActions;
