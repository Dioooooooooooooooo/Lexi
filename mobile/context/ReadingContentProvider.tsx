import { ReadingMaterial } from '@/models/ReadingMaterial';

import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { createStore, StoreApi, useStore } from 'zustand';

type ReadingContentStore = {
  contents: ReadingMaterial[] | null;
  selectedContent: ReadingMaterial | null;

  setContents: (contents: ReadingMaterial[]) => void;
  selectContent: (content: ReadingMaterial) => void;
};

const ReadingContentContext = createContext<
  StoreApi<ReadingContentStore> | undefined
>(undefined);

type ReadingContentProviderProps = PropsWithChildren & {
  selectedContent: ReadingMaterial;
};

export default function ReadingContentProvider({
  children,
  selectedContent,
}: ReadingContentProviderProps) {
  const [store] = useState(() =>
    createStore<ReadingContentStore>(set => ({
      contents: null,
      selectedContent: selectedContent,
      setContents: (contents: ReadingMaterial[]) => set({ contents: contents }),
      selectContent: (content: ReadingMaterial) =>
        set({ selectedContent: content }),
    })),
  );

  return (
    <ReadingContentContext.Provider value={store}>
      {children}
    </ReadingContentContext.Provider>
  );
}

export function useCountStore<T>(selector: (state: ReadingContentStore) => T) {
  const context = useContext(ReadingContentContext);

  if (!context) {
    throw new Error('CountContext.Provider is missing');
  }

  return useStore(context, selector);
}
