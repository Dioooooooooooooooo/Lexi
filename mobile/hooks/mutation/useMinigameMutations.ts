import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  minigamesControllerGetMinigamesCompletion,
  minigamesControllerCreateSentenceRearrangementLog,
  minigamesControllerCreateChoicesLog,
  minigamesControllerCreateWordsFromLettersLog,
  minigamesControllerCreateWflMinigame,
  minigamesControllerCreateChoicesMinigame,
  minigamesControllerCreateSrMinigame,
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
      const res = await minigamesControllerGetMinigamesCompletion({
        path: { readingSessionID: readingSessionId },
      });
      return res.data?.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate session-related queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.minigames.randomBySession(variables),
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
    mutationFn: async (data: any) => {
      await setupAuthToken();
      const res = await minigamesControllerCreateSentenceRearrangementLog({
        body: data
      });
      return res.data?.data;
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
    mutationFn: async (data: any) => {
      await setupAuthToken();
      const res = await minigamesControllerCreateChoicesLog({
        body: data
      });
      return res.data?.data;
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
    mutationFn: async (data: any) => {
      await setupAuthToken();
      const res = await minigamesControllerCreateWordsFromLettersLog({
        body: data
      });
      return res.data?.data;
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
    mutationFn: async (data: any) => {
      await setupAuthToken();
      const res = await minigamesControllerCreateWflMinigame({
        body: data
      });
      return res.data?.data;
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
    mutationFn: async (data: any) => {
      await setupAuthToken();
      const res = await minigamesControllerCreateChoicesMinigame({
        body: data
      });
      return res.data?.data;
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
    mutationFn: async (data: any) => {
      await setupAuthToken();
      const res = await minigamesControllerCreateSrMinigame({
        body: data
      });
      return res.data?.data;
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
