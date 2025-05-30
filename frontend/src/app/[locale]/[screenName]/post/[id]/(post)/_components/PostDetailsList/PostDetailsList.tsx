import React from 'react';

import FlatList from '@/components/molecules/FlatList';
import PostCard from '@/components/molecules/PostCard';
import PostDetail from '@/components/molecules/PostDetail';
import { ROUTES } from '@/constants/routes';
import { useRouter } from '@/i18n/routing';
import type { Post } from '@/types/post';

type Props = {
  posts: Post[];
};

const PostDetailsList = ({ posts }: Props) => {
  const router = useRouter();

  const handleDeletePostSuccess = () => router.replace(ROUTES.HOME);

  return (
    <FlatList
      scrollToLastIndex
      data={posts}
      renderItem={(post, index) => {
        const isFirstPost = index === 0;
        const isLastPost = index === posts.length - 1;
        const isReply = !!post.reply;

        if (isLastPost)
          return (
            <PostDetail key={post.id} post={post} showThreadLineAbove={isReply && isLastPost} />
          );

        return (
          <PostCard
            key={post.id}
            className='border-b-0'
            post={post}
            showThreadLineAbove={!isFirstPost && !isLastPost}
            showThreadLineBelow
            onDeleteSuccess={handleDeletePostSuccess}
          />
        );
      }}
    />
  );
};

export default PostDetailsList;
