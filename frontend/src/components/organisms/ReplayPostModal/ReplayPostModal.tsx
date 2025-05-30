import React from 'react';

import Box from '@/components/atoms/Box';
import Modal from '@/components/atoms/Modal';
import Textarea from '@/components/atoms/Textarea';
import UserAvatar from '@/components/molecules/UserAvatar';
import { VALIDATION } from '@/constants/validation';
import type { Post } from '@/types/post';
import { useTranslations } from 'next-intl';

import { ReplayPostContent } from './ReplayPostContent';
import { useReplayPostModal } from './useReplayPostModal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
};

const ReplayPostModal = ({ isOpen, onClose, post }: Props) => {
  const t = useTranslations();
  const { text, handleChangeText, handleReply, isPending, isChanged, disabled } =
    useReplayPostModal({
      id: post.id,
      isOpen,
      onClose,
    });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('post.actions.reply')}
      isLoading={isPending}
      acceptButtonText={t('post.actions.reply')}
      acceptButtonProps={{
        disabled: disabled || !isChanged,
      }}
      onAccept={handleReply}
      panel={{ className: 'min-h-auto' }}
      discardChanges={{
        isChanged,
      }}
    >
      <Box className='px-4 py-3'>
        <ReplayPostContent post={post} />

        <Box className='flex-row'>
          <Box className='shrink-0 pt-2'>
            <UserAvatar withLink={false} />
          </Box>
          <Box className='grow'>
            <Textarea
              name='replyPostText'
              label={t('post.replyPostLabel')}
              value={text}
              onValueChange={handleChangeText}
              maxLength={VALIDATION.POST.REPLY.MAX}
              rows={3}
              disabled={isPending}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ReplayPostModal;
