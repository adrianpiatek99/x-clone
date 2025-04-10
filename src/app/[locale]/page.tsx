'use client';

import Box from '@/components/atoms/Box';
import CreatePostForm from '@/components/organisms/CreatePostForm';
import { useAppSession } from '@/hooks/useAppSession';

export default function Home() {
  const { user } = useAppSession();

  return (
    <Box className='min-h-screen gap-0'>
      {user && (
        <Box className='hidden gap-0 border-b border-border-1 sm:flex'>
          <CreatePostForm />
        </Box>
      )}
    </Box>
  );
}
