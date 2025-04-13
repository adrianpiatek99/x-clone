import { produce } from 'immer';

export type InfiniteQueryData<R> = {
  pages: R[];
};

export const updateInfiniteQueryWithNewItem = <
  T,
  R extends { nextCursor: unknown },
  K extends keyof Omit<R, 'nextCursor'> & string,
>(
  oldData: InfiniteQueryData<R> | undefined,
  newItem: T,
  options: {
    itemsKey: K;
    position?: 'start' | 'end';
  }
) => {
  if (!oldData) return oldData;

  const { itemsKey, position = 'start' } = options;

  return produce(oldData, (draft) => {
    if (draft.pages.length > 0) {
      const firstPage = draft.pages[0] as R;
      const items = firstPage[itemsKey] as unknown as T[];

      if (position === 'start') {
        items.unshift(newItem);
      } else {
        items.push(newItem);
      }
    }
  });
};
