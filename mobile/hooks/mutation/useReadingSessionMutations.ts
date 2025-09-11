import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, setupAuthToken } from '../api/apiUtils';
import {
  ReadingSessionsService,
  type PostReadingSessionsData,
  type PatchReadingSessionsByIdData,
  type DeleteReadingSessionsByIdData,
} from '../api/requests';

// =============================================================================
// READING SESSION MUTATIONS - Data Modification Hooks
// =============================================================================

export const useCreateReadingSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PostReadingSessionsData) => {
      await setupAuthToken();
      return ReadingSessionsService.postReadingSessions(data);
    },
    onSuccess: () => {
      // Invalidate reading sessions list to refetch updated data
      queryClient.invalidateQueries({ queryKey: queryKeys.readingSessions.list() });
    },
    onError: (error: any) => {
      console.error('Create reading session failed:', error);
    },
  });
};

export const useUpdateReadingSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PatchReadingSessionsByIdData) => {
      await setupAuthToken();
      return ReadingSessionsService.patchReadingSessionsById(data);
    },
    onSuccess: (updatedData, variables) => {
      // Update the specific reading session in cache
      queryClient.setQueryData(
        queryKeys.readingSessions.detail(variables.id),
        updatedData
      );
      // Invalidate reading sessions list to refetch updated data
      queryClient.invalidateQueries({ queryKey: queryKeys.readingSessions.list() });
    },
    onError: (error: any) => {
      console.error('Update reading session failed:', error);
    },
  });
};

export const useDeleteReadingSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: DeleteReadingSessionsByIdData) => {
      await setupAuthToken();
      return ReadingSessionsService.deleteReadingSessionsById(data);
    },
    onSuccess: (_, variables) => {
      // Remove the specific reading session from cache
      queryClient.removeQueries({ 
        queryKey: queryKeys.readingSessions.detail(variables.id) 
      });
      // Invalidate reading sessions list to refetch updated data
      queryClient.invalidateQueries({ queryKey: queryKeys.readingSessions.list() });
    },
    onError: (error: any) => {
      console.error('Delete reading session failed:', error);
    },
  });
};