import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, extractUser } from '../models/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  deleteAccount as apiDeleteAccount,
  useHandleUpdateProfile,
} from '~/services/UserService';

type UserStore = {
  user: User | null;
  setUser: (user: User | null) => void;
  updateProfile: (updatedUser: User) => Promise<void>;
  deleteAccount: () => Promise<void>;

  streak: number;
  setStreak: (streak: number) => void;

  lastLoginStreak: string | null;
  setLastLoginStreak: (date: string) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    set => {
      return {
        user: null,
        lastLoginStreak: null,
        setUser: (user: UserStore['user']) => set({ user }),
        updateProfile: async (updatedUser: User) => {
          console.log('Updating user with:', updatedUser);
          try {
            set({
              user: updatedUser,
            });
          } catch (error: any) {
            throw new Error(
              error instanceof Error ? error.message : 'Unknown error occurred',
            );
          }
        },
        deleteAccount: async () => {
          await apiDeleteAccount();
          set({ user: null });
        },
        streak: 1,
        setStreak: (streak: number) => set(state => ({ streak: streak })),
        setLastLoginStreak: (date: string) =>
          set(state => ({ lastLoginStreak: date })),
      };
    },
    {
      name: 'user-store',
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
