import AsyncStorage from '@react-native-async-storage/async-storage';
import { client } from './requests';

const ipAddress = process.env.EXPO_PUBLIC_IPADDRESS;

// Export the configured client for use in mutations
export { client };

// Configure API client with token from AsyncStorage
export const setupAuthToken = async () => {
  const token = await AsyncStorage.getItem('access_token');
  // Update client configuration
  client.setConfig({
    baseUrl: `http://${ipAddress}:3000`,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  return token;
};

// Initialize auth on module load
setupAuthToken();

// Query Keys Factory
export const queryKeys = {
  // Health keys
  health: {
    all: ['health'] as const,
    root: () => [...queryKeys.health.all, 'root'] as const,
    status: () => [...queryKeys.health.all, 'status'] as const,
  },
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
    byUsername: (username: string) =>
      [...queryKeys.pupils.all, 'by-username', username] as const,
    leaderboardById: (id: string) =>
      [...queryKeys.pupils.all, 'leaderboard', id] as const,
  },
  // Classrooms keys
  classrooms: {
    all: ['classrooms'] as const,
    list: () => [...queryKeys.classrooms.all, 'list'] as const,
    detail: (id: string) =>
      [...queryKeys.classrooms.all, 'detail', id] as const,
    // join:()
  },
  // Minigames keys
  minigames: {
    all: ['minigames'] as const,
    randomByMaterial: (materialId: string) =>
      [...queryKeys.minigames.all, 'random-by-material', materialId] as const,
    randomBySession: (sessionId: string) =>
      [...queryKeys.minigames.all, 'random-by-session', sessionId] as const,
    wordsFromLetters: (materialId: string) =>
      [...queryKeys.minigames.all, 'words-from-letters', materialId] as const,
    minigameLogs: (sessionId: string) =>
      [...queryKeys.minigames.all, 'minigame-logs', sessionId] as const,
  },
  // Achievements keys
  achievements: {
    all: ['achievements'] as const,
    list: () => [...queryKeys.achievements.all, 'list'] as const,
    byPupil: (pupilId: string) =>
      [...queryKeys.achievements.all, 'pupil', pupilId] as const,
  },
  // Activities keys
  activities: {
    all: ['activities'] as const,
    byClassroom: (classroomId: string) =>
      [...queryKeys.activities.all, 'classroom', classroomId] as const,
    detail: (classroomId: string, activityId: string) =>
      [
        ...queryKeys.activities.all,
        'classroom',
        classroomId,
        'activity',
        activityId,
      ] as const,
  },
  // Activity Logs keys
  activityLogs: {
    all: ['activity-logs'] as const,
    list: () => [...queryKeys.activityLogs.all, 'list'] as const,
  },
  // User keys
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
  },
  // Dictionary keys
  dictionary: {
    all: ['dictionary'] as const,
    list: () => [...queryKeys.dictionary.all, 'list'] as const,
  },
  // Reading Sessions keys
  readingSessions: {
    all: ['reading-sessions'] as const,
    list: () => [...queryKeys.readingSessions.all, 'list'] as const,
    detail: (id: string) =>
      [...queryKeys.readingSessions.all, 'detail', id] as const,
  },
  // Reading Materials keys
  readingMaterials: {
    all: ['reading-materials'] as const,
    list: () => [...queryKeys.readingMaterials.all, 'list'] as const,
    detail: (id: string) =>
      [...queryKeys.readingMaterials.all, 'detail', id] as const,
    recommendations: () =>
      [...queryKeys.readingMaterials.all, 'recommendations'] as const,
  },
  // Genres keys
  genres: {
    all: ['genres'] as const,
    list: () => [...queryKeys.genres.all, 'list'] as const,
  },
} as const;

// Hook to configure auth token manually if needed
export const useConfigureAuth = () => {
  return {
    setToken: async (token: string | null) => {
      if (token) {
        await AsyncStorage.setItem('access_token', token);
      } else {
        await AsyncStorage.removeItem('access_token');
      }
      await setupAuthToken();
    },
    getConfig: () => ({
      base: `http://${ipAddress}:3000`,
      token: null, // Token is managed internally by setupAuthToken
    }),
  };
};
