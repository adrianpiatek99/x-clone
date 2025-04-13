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

  return produce(oldData, ({ pages }) => {
    if (pages.length > 0) {
      const firstPage = pages[0] as R;
      const items = firstPage[itemsKey] as unknown as T[];

      if (position === 'start') {
        items.unshift(newItem);
      } else {
        items.push(newItem);
      }
    }
  });
};

export const updateInfiniteQueryWithDeletedItem = <
  R extends { nextCursor: unknown },
  K extends keyof Omit<R, 'nextCursor'> & string,
>(
  oldData: InfiniteQueryData<R> | undefined,
  deletedItemId: string,
  options: {
    itemsKey: K;
  }
) => {
  if (!oldData) return oldData;

  const { itemsKey } = options;

  return produce(oldData, ({ pages }) => {
    pages.forEach((page) => {
      const typedPage = page as Record<K, Array<{ id: string }>>;

      typedPage[itemsKey] = typedPage[itemsKey].filter((item) => item.id !== deletedItemId);
    });
  });
};
