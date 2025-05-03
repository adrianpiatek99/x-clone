import { useMemo } from 'react';

import { EMPTY_STATE_EMOJIS } from '@/constants/strings';

export const useRandomEmoji = () => {
  const randomEmptyStateEmoji = useMemo(
    () => EMPTY_STATE_EMOJIS[Math.floor(Math.random() * EMPTY_STATE_EMOJIS.length)],
    []
  );

  return { randomEmptyStateEmoji };
};
