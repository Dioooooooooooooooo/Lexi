import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api/client';
import { Minigame } from '../models/Minigame';
import { MinigameLog } from '../models/MinigameLog';
import { ReadingSession } from '../models/ReadingSession';

// Types
export interface CreateMinigameLogData {
  minigame_id: string;
  reading_session_id: string;
  score: number;
  time_spent: number;
  correct_answers: number;
  total_questions: number;
  completed: boolean;
}

export interface CompleteSessionData {
  reading_session_id: string;
  total_time_spent: number;
  completion_percentage: number;
}

// Query Keys
export const MINIGAME_KEYS = {
  all: ['minigames'] as const,
  lists: () => [...MINIGAME_KEYS.all, 'list'] as const,
  list: (filters: string) => [...MINIGAME_KEYS.lists(), { filters }] as const,
  details: () => [...MINIGAME_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...MINIGAME_KEYS.details(), id] as const,
  random: (rmId?: string) => [...MINIGAME_KEYS.all, 'random', rmId] as const,
  logs: (minigameId: string, sessionId: string) => 
    [...MINIGAME_KEYS.all, 'logs', minigameId, sessionId] as const,
} as const;

// API Functions
const minigameApi = {
  getById: async (id: string): Promise<Minigame> => {
    return apiClient.get(`/minigames/${id}`);
  },

  getRandomMinigames: async (): Promise<Minigame[]> => {
    return apiClient.get('/minigames/random');
  },

  getRandomMinigamesByRMId: async (readingMaterialId: string): Promise<Minigame[]> => {
    return apiClient.get(`/minigames/random/${readingMaterialId}`);
  },

  createLog: async (data: CreateMinigameLogData): Promise<MinigameLog> => {
    return apiClient.post('/minigame-logs', data);
  },

  getLogByMinigameAndSession: async (
    minigameId: string, 
    sessionId: string
  ): Promise<MinigameLog> => {
    return apiClient.get(`/minigame-logs/${minigameId}/${sessionId}`);
  },

  completeSession: async (data: CompleteSessionData): Promise<ReadingSession> => {
    return apiClient.patch(`/reading-sessions/${data.reading_session_id}/complete`, data);
  },
};

// Query Hooks

export const useGetMinigameById = (id: string) => {
  return useQuery({
    queryKey: MINIGAME_KEYS.detail(id),
    queryFn: () => minigameApi.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes - minigames don't change often
  });
};

export const useRandomMinigames = () => {
  return useQuery({
    queryKey: MINIGAME_KEYS.random(),
    queryFn: minigameApi.getRandomMinigames,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRandomMinigamesByRMId = (readingMaterialId: string) => {
  return useQuery({
    queryKey: MINIGAME_KEYS.random(readingMaterialId),
    queryFn: () => minigameApi.getRandomMinigamesByRMId(readingMaterialId),
    enabled: !!readingMaterialId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetMinigameLogByMIDRSID = (minigameId: string, sessionId: string) => {
  return useQuery({
    queryKey: MINIGAME_KEYS.logs(minigameId, sessionId),
    queryFn: () => minigameApi.getLogByMinigameAndSession(minigameId, sessionId),
    enabled: !!(minigameId && sessionId),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Mutation Hooks

export const useCreateMinigameLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: minigameApi.createLog,
    onSuccess: (_, variables) => {
      // Invalidate the specific log query
      queryClient.invalidateQueries({
        queryKey: MINIGAME_KEYS.logs(variables.minigame_id, variables.reading_session_id)
      });
      
      // Invalidate session-related queries that might show progress
      queryClient.invalidateQueries({
        queryKey: ['reading-sessions', variables.reading_session_id]
      });
    },
    onError: (error: any) => {
      console.error('Failed to create minigame log:', error);
    },
  });
};

export const useCompleteMinigameSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: minigameApi.completeSession,
    onSuccess: (_, variables) => {
      // Invalidate the reading session
      queryClient.invalidateQueries({
        queryKey: ['reading-sessions', variables.reading_session_id]
      });
      
      // Invalidate user stats and achievements
      queryClient.invalidateQueries({
        queryKey: ['user', 'profile']
      });
      
      // Invalidate classroom leaderboards
      queryClient.invalidateQueries({
        queryKey: ['classrooms']
      });
    },
    onError: (error: any) => {
      console.error('Failed to complete minigame session:', error);
    },
  });
};