import React, { memo, useState } from 'react';

import Dropdown, { DropdownItem } from '@/components/atoms/Dropdown';
import Icon from '@/components/atoms/Icon';
import IconButton from '@/components/atoms/IconButton';
import { ROUTES } from '@/constants/routes';
import type { Post } from '@/db/schema';
import { useDeletePostMutation } from '@/hooks/api/posts/mutations';
import { useRouter } from '@/i18n/routing';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

const LazyConfirmModal = dynamic(
  () => import('@/components/atoms/ConfirmModal').then((mod) => mod.ConfirmModal),
  {
    ssr: false,
  }
);
const LazyEditPostModal = dynamic(() => import('@/components/organisms/EditPostModal'), {
  ssr: false,
});

type Props = {
  post: Pick<Post, 'id' | 'author' | 'text' | 'media' | 'isAuthor'>;
  onDeleteSuccess?: () => void;
};

export const PostCardDropdown = memo(({ post, onDeleteSuccess }: Props) => {
  const {
    id,
    author: { screenName },
    isAuthor,
  } = post;
  const t = useTranslations();
  const router = useRouter();
  const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { deletePost, isDeleting } = useDeletePostMutation({
    screenName,
    onSuccess: () => {
      onDeleteSuccess?.();
    },
  });

  const handleDeletePost = () => {
    if (!isAuthor) return;

    setIsDeletePostModalOpen(false);
    deletePost({ id });
  };

  return (
    <>
      <div className='my-[-8px] mr-[-6px] flex items-center'>
        <Dropdown>
          <IconButton title={t('post.actions.more')} color='secondary'>
            <Icon name='MoreHorizontalIcon' />
          </IconButton>
          {isAuthor && (
            <DropdownItem icon={<Icon name='EditIcon' />} onClick={() => setIsEditModalOpen(true)}>
              {t('post.actions.edit')}
            </DropdownItem>
          )}
          <DropdownItem
            icon={<Icon name='MonitoringIcon' />}
            onClick={() => router.push(ROUTES.POST.REPOSTS(screenName, id))}
          >
            {t('post.actions.viewPostEngagements')}
          </DropdownItem>
          {isAuthor && (
            <DropdownItem
              onClick={() => setIsDeletePostModalOpen(true)}
              icon={<Icon name='RemoveIcon' />}
              disabled={isDeleting}
              danger
            >
              {t('post.actions.delete')}
            </DropdownItem>
          )}
        </Dropdown>
      </div>
      <LazyConfirmModal
        title={t('post.confirmDeleteModal.title')}
        description={t('post.confirmDeleteModal.description')}
        acceptButtonText={t('post.actions.delete')}
        isOpen={isDeletePostModalOpen}
        onClose={() => setIsDeletePostModalOpen(false)}
        onAccept={handleDeletePost}
        preventClosingOnOutside={false}
      />
      <LazyEditPostModal
        post={post}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
});
