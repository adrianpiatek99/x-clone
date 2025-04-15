import React, { memo, useState } from 'react';

import Dropdown, { DropdownItem } from '@/components/atoms/Dropdown';
import IconButton from '@/components/atoms/IconButton';
import { ROUTES } from '@/constants/routes';
import type { Post } from '@/db/schema';
import { useDeletePostMutation } from '@/hooks/api/posts/useDeletePostMutation';
import { useRouter } from '@/i18n/routing';
import { EditIcon, MonitoringIcon, MoreHorizontalIcon, RemoveIcon } from '@/icons';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

const LazyConfirmModal = dynamic(() =>
  import('@/components/atoms/ConfirmModal').then((mod) => mod.ConfirmModal)
);

type Props = Pick<Post, 'id' | 'author'> & {
  isAuthor: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

export const PostCardDropdown = memo(
  ({ id, author: { screenName }, isAuthor, setIsLoading }: Props) => {
    const t = useTranslations();
    const router = useRouter();
    const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
    const { deletePost, isDeleting } = useDeletePostMutation({
      onSettled: () => {
        setIsLoading(false);
      },
    });

    const handleDeletePost = () => {
      if (!isAuthor) return;

      setIsLoading(true);
      setIsDeletePostModalOpen(false);
      deletePost({ id });
    };

    return (
      <>
        <div className='my-[-8px] mr-[-6px] flex items-center'>
          <Dropdown>
            <IconButton title={t('post.actions.more')} color='secondary'>
              <MoreHorizontalIcon />
            </IconButton>
            {isAuthor && <DropdownItem icon={<EditIcon />}>{t('post.actions.edit')}</DropdownItem>}
            <DropdownItem
              icon={<MonitoringIcon />}
              onClick={() => router.push(ROUTES.POST.REPOSTS(screenName, id))}
            >
              {t('post.actions.viewPostEngagements')}
            </DropdownItem>
            {isAuthor && (
              <DropdownItem
                onClick={() => setIsDeletePostModalOpen(true)}
                icon={<RemoveIcon />}
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
      </>
    );
  }
);
