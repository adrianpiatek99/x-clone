import React from 'react';

import Avatar from '@/components/atoms/Avatar';
import Box from '@/components/atoms/Box';
import { PostCardAuthor, PostCardStatuses, PostCardText } from '@/components/molecules/PostCard';
import type { Post } from '@/types/post';

type Props = {
  post: Post;
};

export const ReplayPostContent = ({
  post: { id, author, text, createdAt, editedAt, reply },
}: Props) => {
  const { avatarUrl, screenName } = author;

  return (
    <Box className='flex-row'>
      <Box className='shrink-0 gap-0'>
        <Avatar src={avatarUrl} screenName={screenName} />
        <div className='mx-auto mt-1 h-full w-0.5 grow bg-border-1' />
      </Box>
      <Box className='grow gap-1.5'>
        <Box className='flex-row items-center justify-between gap-1'>
          <PostCardAuthor id={id} author={author} createdAt={createdAt} preview />
        </Box>
        <Box>
          <Box className='gap-1.5'>
            <PostCardStatuses reply={reply} editedAt={editedAt} />
            <div className='pb-3'>
              <PostCardText text={text} />
            </div>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
