import type { QueryClient } from '@tanstack/react-query';
import type { Draft } from 'immer';
import { produce } from 'immer';

export type InfiniteQueryData<R> = {
  pages: R[];
};

type QueryKey = readonly unknown[] | string[];

const updateInfiniteQueryWithNewItem = <
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

const updateInfiniteQueryWithDeletedItem = <
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

const updateInfiniteQueryWithUpdatedItem = <
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

// Add item

export const addItemToInfiniteQueryCache = <TResponse extends { nextCursor: unknown }>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  newItem: TResponse[keyof Omit<TResponse, 'nextCursor'> & string] extends (infer U)[]
    ? U & { id: string }
    : never,
  options: {
    itemsKey: keyof Omit<TResponse, 'nextCursor'> & string;
    position?: 'start' | 'end';
  }
) => {
  const { itemsKey, position = 'start' } = options;

  queryClient.setQueryData<InfiniteQueryData<TResponse>>(queryKey, (oldData) =>
    updateInfiniteQueryWithNewItem(oldData, newItem, { itemsKey, position })
  );
};

export const addItemToSimpleArrayCache = <TItem extends { id: string }>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  newItem: TItem,
  options: {
    itemsKey: string;
    position?: 'start' | 'end';
  }
) => {
  const { itemsKey, position = 'start' } = options;

  queryClient.setQueryData<{ [key: string]: TItem[] }>(queryKey, (oldData) =>
    produce(oldData, (draft) => {
      if (!draft) {
        draft = { [itemsKey]: [] };
      }

      if (!draft[itemsKey]) {
        draft[itemsKey] = [];
      }

      if (position === 'start') {
        (draft[itemsKey] as Draft<TItem>[]).unshift(newItem as Draft<TItem>);
      } else {
        (draft[itemsKey] as Draft<TItem>[]).push(newItem as Draft<TItem>);
      }
    })
  );
};

// Delete item

export const deleteItemFromInfiniteQueryCache = <TResponse extends { nextCursor: unknown }>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  itemId: string,
  options: {
    itemsKey: keyof Omit<TResponse, 'nextCursor'> & string;
  }
) => {
  const { itemsKey } = options;

  queryClient.setQueryData<InfiniteQueryData<TResponse>>(queryKey, (oldData) =>
    updateInfiniteQueryWithDeletedItem(oldData, itemId, { itemsKey })
  );
};

export const deleteItemFromSimpleArrayCache = <TItem extends { id: string }>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  itemId: string,
  options: {
    itemsKey: string;
  }
) => {
  const { itemsKey } = options;

  queryClient.setQueryData<{ [key: string]: TItem[] }>(queryKey, (oldData) =>
    produce(oldData, (draft) => {
      if (draft && draft[itemsKey]) {
        const itemIndex = draft[itemsKey].findIndex((item) => item.id === itemId);

        if (itemIndex !== -1) {
          draft[itemsKey].splice(itemIndex, 1);
        }
      }
    })
  );
};

export const deleteItemFromCache = <TItem extends { id: string }>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  itemId: string
) => {
  queryClient.setQueryData<TItem | null>(queryKey, (oldData) => {
    if (!oldData || oldData.id !== itemId) {
      return oldData;
    }

    return null;
  });
};

// Update item

export const updateItemInInfiniteQueryCache = <TResponse extends { nextCursor: unknown }>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  itemId: string,
  updateFn: (
    item: Draft<
      TResponse[keyof Omit<TResponse, 'nextCursor'> & string] extends (infer U)[]
        ? U & { id: string }
        : never
    >
  ) => void,
  options: {
    itemsKey: keyof Omit<TResponse, 'nextCursor'> & string;
  }
) => {
  const { itemsKey } = options;

  queryClient.setQueryData<InfiniteQueryData<TResponse>>(queryKey, (oldData) =>
    updateInfiniteQueryWithUpdatedItem(oldData, itemId, updateFn, { itemsKey })
  );
};

export const updateItemInSimpleArrayCache = <TItem extends { id: string }>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  itemId: string,
  updateFn: (item: Draft<TItem>) => void,
  options: {
    itemsKey: string;
  }
) => {
  const { itemsKey } = options;

  queryClient.setQueryData<{ [key: string]: TItem[] }>(queryKey, (oldData) =>
    produce(oldData, (draft) => {
      if (draft && draft[itemsKey]) {
        const item = draft[itemsKey].find((item) => item.id === itemId);

        if (item) {
          updateFn(item as Draft<TItem>);
        }
      }
    })
  );
};

export const updateItemInCache = <TItem>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  updateFn: (item: Draft<TItem>) => void
) => {
  queryClient.setQueryData<TItem>(queryKey, (oldData: TItem | undefined) =>
    produce(oldData, (draft) => {
      if (draft) {
        updateFn(draft as Draft<TItem>);
      }
    })
  );
};
