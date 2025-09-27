import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReadingMaterial } from '@/models/ReadingMaterial';

interface LibraryStore {
  library: ReadingMaterial[];
  setLibrary: (library: ReadingMaterial[]) => void;
}

export const useLibraryStore = create<LibraryStore>()(
  persist(
    set => ({
      library: [],
      setLibrary: (library: ReadingMaterial[]) => set({ library: library }),
    }),
    {
      name: 'library-store',
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

