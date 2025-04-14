import { produce, Draft } from 'immer';

export type InfiniteQueryData<R> = {
  pages: R[];
};

export const updateInfiniteQueryWithNewItem = <
  TResponse extends { nextCursor: unknown },
  TItemsKey extends keyof Omit<TResponse, 'nextCursor'> & string,
  TNewItem,
>(
  oldData: InfiniteQueryData<TResponse> | undefined,
  newItem: TNewItem,
  options: {
    itemsKey: TItemsKey;
    position?: 'start' | 'end';
  }
) => {
  if (!oldData) return oldData;

  const { itemsKey, position = 'start' } = options;

  return produce(oldData, ({ pages }) => {
    if (pages.length > 0) {
      const firstPage = pages[0] as TResponse;
      const items = firstPage[itemsKey] as unknown as TNewItem[];

      if (position === 'start') {
        items.unshift(newItem);
      } else {
        items.push(newItem);
      }
    }
  });
};

export const updateInfiniteQueryWithDeletedItem = <
  TResponse extends { nextCursor: unknown },
  TItemsKey extends keyof Omit<TResponse, 'nextCursor'> & string,
>(
  oldData: InfiniteQueryData<TResponse> | undefined,
  deletedItemId: string,
  options: {
    itemsKey: TItemsKey;
  }
) => {
  if (!oldData) return oldData;

  const { itemsKey } = options;

  return produce(oldData, ({ pages }) => {
    pages.forEach((page) => {
      const typedPage = page as Record<TItemsKey, Array<{ id: string }>>;

      typedPage[itemsKey] = typedPage[itemsKey].filter((item) => item.id !== deletedItemId);
    });
  });
};

export const updateInfiniteQueryWithUpdatedItem = <
  TResponse extends { nextCursor: unknown },
  TItemsKey extends keyof Omit<TResponse, 'nextCursor'> & string,
  TItem extends TResponse[TItemsKey] extends (infer U)[] ? U & { id: string } : never,
>(
  oldData: InfiniteQueryData<TResponse> | undefined,
  itemId: string,
  update: (item: Draft<TItem>) => void,
  options: {
    itemsKey: TItemsKey;
  }
) => {
  if (!oldData) return oldData;

  const { itemsKey } = options;

  return produce(oldData, (draft) => {
    draft.pages.forEach((page) => {
      const items = (page as Record<TItemsKey, TItem[]>)[itemsKey];
      const item = items.find((item: TItem) => item.id === itemId);

      if (item) {
        update(item as Draft<TItem>);
      }
    });
  });
};
