import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReadingMaterial } from '@/models/ReadingMaterial';

interface ReadingContentStore {
  contents: ReadingMaterial[];
  selectedContent: ReadingMaterial | null;

  setContents: (contents: ReadingMaterial[]) => void;
  setSelectedContent: (content: ReadingMaterial | null) => void;

  fontSize: number;
  setFontSize: (size: number) => void;
}

export const useReadingContentStore = create<ReadingContentStore>()(
  persist(
    set => ({
      contents: [],
      selectedContent: null,
      fontSize: 16,
      setContents: (contents: ReadingMaterial[]) => set({ contents: contents }),
      setSelectedContent: (content: ReadingMaterial | null) =>
        set({ selectedContent: content }),
      setFontSize: (size: number) => set({ fontSize: size }),
    }),
    {
      name: 'reading-content-store',
      storage: {
        getItem: async name => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async name => {
          await AsyncStorage.removeItem(name);
        },
      },
    },
  ),
);
