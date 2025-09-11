import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  MinigamesService,
  type PostMinigamesLogsSentenceRearrangementData,
  type PostMinigamesLogsChoicesData,
  type PostMinigamesLogsWordsFromLettersData,
  type PostMinigamesWordsFromLettersData,
  type PostMinigamesChoicesData,
  type PostMinigamesSentenceRearrangementData,
} from '../api/requests';
import { setupAuthToken, queryKeys } from '../api/apiUtils';

// =============================================================================
// MINIGAME MUTATIONS - Data Modification Hooks
// =============================================================================

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
// MINIGAME CREATION MUTATIONS - Create New Minigames
// =============================================================================

export const useCreateWordsFromLettersMinigame = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PostMinigamesWordsFromLettersData) => {
      await setupAuthToken();
      return MinigamesService.postMinigamesWordsFromLetters(data);
    },
    onSuccess: () => {
      // Invalidate minigame related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.minigames.all });
    },
    onError: (error: any) => {
      console.error('Failed to create words from letters minigame:', error);
    },
  });
};

export const useCreateChoicesMinigame = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PostMinigamesChoicesData) => {
      await setupAuthToken();
      return MinigamesService.postMinigamesChoices(data);
    },
    onSuccess: () => {
      // Invalidate minigame related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.minigames.all });
    },
    onError: (error: any) => {
      console.error('Failed to create choices minigame:', error);
    },
  });
};

export const useCreateSentenceRearrangementMinigame = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PostMinigamesSentenceRearrangementData) => {
      await setupAuthToken();
      return MinigamesService.postMinigamesSentenceRearrangement(data);
    },
    onSuccess: () => {
      // Invalidate minigame related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.minigames.all });
    },
    onError: (error: any) => {
      console.error('Failed to create sentence rearrangement minigame:', error);
    },
  });
};