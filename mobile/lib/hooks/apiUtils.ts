import AsyncStorage from '@react-native-async-storage/async-storage';
import { OpenAPI } from './requests';

// Configure OpenAPI client with token from AsyncStorage
export const setupAuthToken = async () => {
  const token = await AsyncStorage.getItem('access_token');
  OpenAPI.TOKEN = token || undefined;
  OpenAPI.BASE = 'http://localhost:3000';
};

// Initialize auth on module load
setupAuthToken();

// Query Keys Factory
export const queryKeys = {
  // Auth keys
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
    profile: () => [...queryKeys.auth.all, 'profile'] as const,
    verifyToken: () => [...queryKeys.auth.all, 'verify-token'] as const,
  },
  // Pupils keys
  pupils: {
    all: ['pupils'] as const,
    me: () => [...queryKeys.pupils.all, 'me'] as const,
    leaderboard: () => [...queryKeys.pupils.all, 'leaderboard'] as const,
    byUsername: (username: string) => [...queryKeys.pupils.all, 'by-username', username] as const,
    leaderboardById: (id: string) => [...queryKeys.pupils.all, 'leaderboard', id] as const,
  },
  // Classrooms keys
  classrooms: {
    all: ['classrooms'] as const,
    list: () => [...queryKeys.classrooms.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.classrooms.all, 'detail', id] as const,
  },
  // Minigames keys
  minigames: {
    all: ['minigames'] as const,
    randomByMaterial: (materialId: string) => [...queryKeys.minigames.all, 'random-by-material', materialId] as const,
    randomBySession: (sessionId: string) => [...queryKeys.minigames.all, 'random-by-session', sessionId] as const,
    wordsFromLetters: (materialId: string) => [...queryKeys.minigames.all, 'words-from-letters', materialId] as const,
  },
} as const;

// Hook to configure auth token manually if needed
export const useConfigureAuth = () => {
  return {
    setToken: (token: string | null) => {
      OpenAPI.TOKEN = token || undefined;
      if (token) {
        AsyncStorage.setItem('access_token', token);
      } else {
        AsyncStorage.removeItem('access_token');
      }
    },
    getConfig: () => ({
      base: OpenAPI.BASE,
      token: OpenAPI.TOKEN,
    }),
  };
};