import { useEffect, useState } from 'react';

import { useCreatePostReplyMutation } from '@/hooks/api/posts/mutations';
import type { Post } from '@/types/post';

type Props = {
  isOpen: boolean;
  onClose: () => void;
} & Pick<Post, 'id'>;

export const useReplayPostModal = ({ isOpen, onClose, id }: Props) => {
  const [text, setText] = useState('');
  const { createPostReply, isPending } = useCreatePostReplyMutation();
  const disabled = !text;
  const isChanged = text !== '';

  const handleChangeText = (value: string) => setText(value);

  const handleReply = () => {
    if (disabled || isPending) return;

    createPostReply({
      postId: id,
      text,
    });

    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setText('');
    }
  }, [isOpen]);

  return {
    text,
    handleChangeText,
    handleReply,
    isPending,
    isChanged,
    disabled,
  };
};
