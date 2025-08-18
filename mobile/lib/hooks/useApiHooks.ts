import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  AuthenticationService, 
  PupilsService, 
  ClassroomsService, 
  MinigamesService,
  OpenAPI,
  type PostAuthRegisterData,
  type PostAuthLoginData,
  type PostAuthRefreshData,
  type PatchAuthMeData,
  type PostAuthChangePasswordData,
  type PostAuthLogoutData,
  type PatchPupilsMeData,
  type PostClassroomsData,
  type PatchClassroomsByIdData,
  type PostMinigamesLogsSentenceRearrangementData,
  type PostMinigamesLogsChoicesData,
  type PostMinigamesLogsWordsFromLettersData,
} from './requests';

// Configure OpenAPI client with token from AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure OpenAPI client
const setupAuthToken = async () => {
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

// =============================================================================
// AUTH HOOKS
// =============================================================================

export const useAuthMe = () => {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      await setupAuthToken();
      return AuthenticationService.getAuthMe();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 (unauthorized)
      if (error?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useVerifyToken = () => {
  return useQuery({
    queryKey: queryKeys.auth.verifyToken(),
    queryFn: async () => {
      await setupAuthToken();
      return AuthenticationService.getAuthVerifyToken();
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: false, // Don't retry token verification
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: PostAuthRegisterData) => AuthenticationService.postAuthRegister(data),
    onSuccess: (data) => {
      // Set token in OpenAPI config
      const token = (data as any)?.data?.access_token;
      if (token) {
        OpenAPI.TOKEN = token;
        AsyncStorage.setItem('access_token', token);
      }
      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
    onError: (error: any) => {
      console.error('Registration failed:', error);
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: PostAuthLoginData) => AuthenticationService.postAuthLogin(data),
    onSuccess: (data) => {
      // Set token in OpenAPI config
      const token = (data as any)?.data?.access_token;
      if (token) {
        OpenAPI.TOKEN = token;
        AsyncStorage.setItem('access_token', token);
      }
      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
    },
  });
};

export const useRefreshToken = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: PostAuthRefreshData) => AuthenticationService.postAuthRefresh(data),
    onSuccess: (data) => {
      // Update token
      const token = (data as any)?.data?.access_token;
      if (token) {
        OpenAPI.TOKEN = token;
        AsyncStorage.setItem('access_token', token);
      }
      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
    onError: (error: any) => {
      console.error('Token refresh failed:', error);
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PatchAuthMeData) => {
      await setupAuthToken();
      return AuthenticationService.patchAuthMe(data);
    },
    onSuccess: (data) => {
      // Update profile in cache
      queryClient.setQueryData(queryKeys.auth.me(), data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
    onError: (error: any) => {
      console.error('Profile update failed:', error);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: PostAuthChangePasswordData) => {
      await setupAuthToken();
      return AuthenticationService.postAuthChangePassword(data);
    },
    onError: (error: any) => {
      console.error('Password change failed:', error);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PostAuthLogoutData = {}) => {
      await setupAuthToken();
      return AuthenticationService.postAuthLogout(data);
    },
    onSuccess: () => {
      // Clear token
      OpenAPI.TOKEN = undefined;
      AsyncStorage.removeItem('access_token');
      // Clear all queries
      queryClient.clear();
    },
    onError: (error: any) => {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local token
      OpenAPI.TOKEN = undefined;
      AsyncStorage.removeItem('access_token');
      queryClient.clear();
    },
  });
};

// =============================================================================
// PUPILS HOOKS  
// =============================================================================

export const usePupilMe = () => {
  return useQuery({
    queryKey: queryKeys.pupils.me(),
    queryFn: async () => {
      await setupAuthToken();
      return PupilsService.getPupilsMe();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useUpdatePupilProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PatchPupilsMeData) => {
      await setupAuthToken();
      return PupilsService.patchPupilsMe(data);
    },
    onSuccess: (data) => {
      // Update pupil profile in cache
      queryClient.setQueryData(queryKeys.pupils.me(), data);
    },
    onError: (error: any) => {
      console.error('Pupil profile update failed:', error);
    },
  });
};

export const usePupilsLeaderboard = () => {
  return useQuery({
    queryKey: queryKeys.pupils.leaderboard(),
    queryFn: async () => {
      await setupAuthToken();
      return PupilsService.getPupilsLeaderboard();
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const usePupilLeaderboardById = (pupilId: string) => {
  return useQuery({
    queryKey: queryKeys.pupils.leaderboardById(pupilId),
    queryFn: async () => {
      await setupAuthToken();
      return PupilsService.getPupilsLeaderboardByPupilId();
    },
    enabled: !!pupilId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const usePupilByUsername = (username: string) => {
  return useQuery({
    queryKey: queryKeys.pupils.byUsername(username),
    queryFn: async () => {
      await setupAuthToken();
      return PupilsService.getPupilsByUsername({ username });
    },
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// =============================================================================
// CLASSROOMS HOOKS
// =============================================================================

export const useClassrooms = () => {
  return useQuery({
    queryKey: queryKeys.classrooms.list(),
    queryFn: () => ClassroomsService.getClassrooms(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useClassroomById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.classrooms.detail(id),
    queryFn: () => ClassroomsService.getClassroomsById({ id }),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateClassroom = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PostClassroomsData) => {
      await setupAuthToken();
      return ClassroomsService.postClassrooms(data);
    },
    onSuccess: () => {
      // Invalidate and refetch classrooms
      queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.list() });
    },
    onError: (error: any) => {
      console.error('Failed to create classroom:', error);
    },
  });
};

export const useUpdateClassroom = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: PatchClassroomsByIdData) => ClassroomsService.patchClassroomsById(data),
    onSuccess: (data, variables) => {
      // Update the classroom in cache
      queryClient.setQueryData(queryKeys.classrooms.detail(variables.id), data);
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.list() });
    },
    onError: (error: any) => {
      console.error('Failed to update classroom:', error);
    },
  });
};

export const useDeleteClassroom = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => ClassroomsService.deleteClassroomsById({ id }),
    onSuccess: () => {
      // Invalidate all classroom queries
      queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.all });
    },
    onError: (error: any) => {
      console.error('Failed to delete classroom:', error);
    },
  });
};

// =============================================================================
// MINIGAMES HOOKS
// =============================================================================

export const useRandomMinigamesByMaterial = (readingMaterialId: string) => {
  return useQuery({
    queryKey: queryKeys.minigames.randomByMaterial(readingMaterialId),
    queryFn: async () => {
      await setupAuthToken();
      return MinigamesService.getMinigamesReadingmaterialsByReadingMaterialIdRandom({ readingMaterialId });
    },
    enabled: !!readingMaterialId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRandomMinigamesBySession = (readingSessionId: string) => {
  return useQuery({
    queryKey: queryKeys.minigames.randomBySession(readingSessionId),
    queryFn: async () => {
      await setupAuthToken();
      return MinigamesService.getMinigamesByReadingSessionIdRandom({ readingSessionId });
    },
    enabled: !!readingSessionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useWordsFromLettersMinigame = (readingMaterialId: string) => {
  return useQuery({
    queryKey: queryKeys.minigames.wordsFromLetters(readingMaterialId),
    queryFn: async () => {
      await setupAuthToken();
      return MinigamesService.getMinigamesByReadingMaterialIdWordsFromLetters({ readingMaterialId });
    },
    enabled: !!readingMaterialId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCompleteMinigameSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (readingSessionId: string) => {
      await setupAuthToken();
      return MinigamesService.postMinigamesByReadingSessionIdComplete({ readingSessionId });
    },
    onSuccess: (_, variables) => {
      // Invalidate session-related queries
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.minigames.randomBySession(variables)
      });
      // Invalidate pupil data as completion affects stats
      queryClient.invalidateQueries({ queryKey: queryKeys.pupils.all });
    },
    onError: (error: any) => {
      console.error('Failed to complete minigame session:', error);
    },
  });
};

export const useCreateSentenceRearrangementLog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PostMinigamesLogsSentenceRearrangementData) => {
      await setupAuthToken();
      return MinigamesService.postMinigamesLogsSentenceRearrangement(data);
    },
    onSuccess: () => {
      // Invalidate minigame related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.minigames.all });
    },
    onError: (error: any) => {
      console.error('Failed to create sentence rearrangement log:', error);
    },
  });
};

export const useCreateChoicesLog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PostMinigamesLogsChoicesData) => {
      await setupAuthToken();
      return MinigamesService.postMinigamesLogsChoices(data);
    },
    onSuccess: () => {
      // Invalidate minigame related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.minigames.all });
    },
    onError: (error: any) => {
      console.error('Failed to create choices log:', error);
    },
  });
};

export const useCreateWordsFromLettersLog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PostMinigamesLogsWordsFromLettersData) => {
      await setupAuthToken();
      return MinigamesService.postMinigamesLogsWordsFromLetters(data);
    },
    onSuccess: () => {
      // Invalidate minigame related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.minigames.all });
    },
    onError: (error: any) => {
      console.error('Failed to create words from letters log:', error);
    },
  });
};

// =============================================================================
// UTILITY HOOKS
// =============================================================================

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