import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api/client';
import { User } from '../models/User';
import { Achievement } from '../models/Achievement';
import { Session } from '../models/Session';

// Types
export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  email?: string;
  profile_picture?: string;
  grade_level?: string;
  school?: string;
}

export interface CreateSessionData {
  reading_material_id: string;
  start_time: string;
}

export interface EndSessionData {
  session_id: string;
  end_time: string;
  total_time_spent: number;
  pages_read: number;
  words_read: number;
  comprehension_score?: number;
}

export interface LoginStreakData {
  user_id: string;
  date: string;
}

// Query Keys
export const USER_KEYS = {
  all: ['user'] as const,
  profile: () => [...USER_KEYS.all, 'profile'] as const,
  achievements: (userId: string) => [...USER_KEYS.all, 'achievements', userId] as const,
  streak: (userId: string) => [...USER_KEYS.all, 'streak', userId] as const,
  sessions: () => [...USER_KEYS.all, 'sessions'] as const,
  session: (id: string) => [...USER_KEYS.sessions(), id] as const,
  stats: () => [...USER_KEYS.all, 'stats'] as const,
  exists: (email: string) => [...USER_KEYS.all, 'exists', email] as const,
} as const;

// API Functions
const userApi = {
  getProfile: async (): Promise<User> => {
    return apiClient.get('/users/profile');
  },

  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    return apiClient.patch('/users/profile', data);
  },

  checkUserExists: async (email: string): Promise<{ exists: boolean }> => {
    return apiClient.get('/users/check-exists', { email });
  },

  deleteAccount: async (): Promise<void> => {
    return apiClient.delete('/users/account');
  },

  getPupilAchievements: async (userId: string): Promise<Achievement[]> => {
    return apiClient.get(`/pupils/${userId}/achievements`);
  },

  getLoginStreak: async (userId: string): Promise<{ streak: number; lastLogin: string }> => {
    return apiClient.get(`/users/${userId}/login-streak`);
  },

  recordLoginStreak: async (data: LoginStreakData): Promise<void> => {
    return apiClient.post('/users/login-streak', data);
  },

  createSession: async (data: CreateSessionData): Promise<Session> => {
    return apiClient.post('/reading-sessions', data);
  },

  getSessionById: async (id: string): Promise<Session> => {
    return apiClient.get(`/reading-sessions/${id}`);
  },

  endSession: async (data: EndSessionData): Promise<Session> => {
    return apiClient.patch(`/reading-sessions/${data.session_id}/end`, data);
  },

  getTotalSessions: async (userId: string): Promise<{ total: number; completed: number }> => {
    return apiClient.get(`/users/${userId}/sessions/stats`);
  },

  getProfileStats: async (): Promise<{
    total_reading_time: number;
    books_completed: number;
    average_score: number;
    current_streak: number;
    total_sessions: number;
  }> => {
    return apiClient.get('/users/profile/stats');
  },
};

// Query Hooks

export const useProfile = () => {
  return useQuery({
    queryKey: USER_KEYS.profile(),
    queryFn: userApi.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 (unauthorized)
      if (error?.statusCode === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useProfileStats = () => {
  return useQuery({
    queryKey: USER_KEYS.stats(),
    queryFn: userApi.getProfileStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const usePupilAchievements = (userId: string) => {
  return useQuery({
    queryKey: USER_KEYS.achievements(userId),
    queryFn: () => userApi.getPupilAchievements(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLoginStreak = (userId: string) => {
  return useQuery({
    queryKey: USER_KEYS.streak(userId),
    queryFn: () => userApi.getLoginStreak(userId),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useCheckUserExists = (email: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: USER_KEYS.exists(email),
    queryFn: () => userApi.checkUserExists(email),
    enabled: enabled && !!email && email.includes('@'),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSessionById = (id: string) => {
  return useQuery({
    queryKey: USER_KEYS.session(id),
    queryFn: () => userApi.getSessionById(id),
    enabled: !!id,
    staleTime: 30 * 1000, // 30 seconds for active sessions
  });
};

export const useTotalSessions = (userId: string) => {
  return useQuery({
    queryKey: [...USER_KEYS.sessions(), 'total', userId],
    queryFn: () => userApi.getTotalSessions(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Mutation Hooks

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: (data) => {
      // Update the profile in cache
      queryClient.setQueryData(USER_KEYS.profile(), data);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: USER_KEYS.stats() });
    },
    onError: (error: any) => {
      console.error('Failed to update profile:', error);
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.deleteAccount,
    onSuccess: () => {
      // Clear all user-related data
      queryClient.clear();
    },
    onError: (error: any) => {
      console.error('Failed to delete account:', error);
    },
  });
};

export const useRecordLoginStreak = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.recordLoginStreak,
    onSuccess: (_, variables) => {
      // Invalidate streak data
      queryClient.invalidateQueries({ 
        queryKey: USER_KEYS.streak(variables.user_id) 
      });
      
      // Invalidate profile stats
      queryClient.invalidateQueries({ queryKey: USER_KEYS.stats() });
    },
    onError: (error: any) => {
      console.error('Failed to record login streak:', error);
    },
  });
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.createSession,
    onSuccess: () => {
      // Invalidate sessions queries
      queryClient.invalidateQueries({ queryKey: USER_KEYS.sessions() });
    },
    onError: (error: any) => {
      console.error('Failed to create session:', error);
    },
  });
};

export const useEndSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.endSession,
    onSuccess: (data, variables) => {
      // Update the specific session in cache
      queryClient.setQueryData(USER_KEYS.session(variables.session_id), data);
      
      // Invalidate sessions and stats
      queryClient.invalidateQueries({ queryKey: USER_KEYS.sessions() });
      queryClient.invalidateQueries({ queryKey: USER_KEYS.stats() });
      
      // Invalidate classroom leaderboards as they may be affected
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
    },
    onError: (error: any) => {
      console.error('Failed to end session:', error);
    },
  });
};