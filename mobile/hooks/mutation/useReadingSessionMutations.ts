import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, setupAuthToken } from '../api/apiUtils';
import {
  readingSessionsControllerCreate,
  readingSessionsControllerUpdate,
  readingSessionsControllerRemove,
} from '../api/requests';

// =============================================================================
// READING SESSION MUTATIONS - Data Modification Hooks
// =============================================================================

export const useCreateReadingSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      try {
        await setupAuthToken();
        const res = await readingSessionsControllerCreate({
          body: data,
        });
        console.log('Reading Session useMutation:', res.data.data);
        return res.data?.data;
      } catch (err) {
        console.error('Reading Session Creation failed:', err);
        throw err;
      }
    },
    onSuccess: () => {
      // Invalidate reading sessions list to refetch updated data
      queryClient.invalidateQueries({
        queryKey: queryKeys.readingSessions.list(),
      });
    },
    onError: (error: any) => {
      console.error('Create reading session failed:', error);
    },
  });
};

export const useUpdateReadingSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; body: any }) => {
      await setupAuthToken();
      const res = await readingSessionsControllerUpdate({
        path: { id: data.id },
        body: data.body,
      });
      return res.data?.data;
    },
    onSuccess: (updatedData, variables) => {
      // Update the specific reading session in cache
      queryClient.setQueryData(
        queryKeys.readingSessions.detail(variables.id),
        updatedData,
      );
      // Invalidate reading sessions list to refetch updated data
      queryClient.invalidateQueries({
        queryKey: queryKeys.readingSessions.list(),
      });
    },
    onError: (error: any) => {
      console.error('Update reading session failed:', error);
    },
  });
};

export const useDeleteReadingSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string }) => {
      await setupAuthToken();
      const res = await readingSessionsControllerRemove({
        path: { id: data.id },
      });
      return res.data?.data;
    },
    onSuccess: (_, variables) => {
      // Remove the specific reading session from cache
      queryClient.removeQueries({
        queryKey: queryKeys.readingSessions.detail(variables.id),
      });
      // Invalidate reading sessions list to refetch updated data
      queryClient.invalidateQueries({
        queryKey: queryKeys.readingSessions.list(),
      });
    },
    onError: (error: any) => {
      console.error('Delete reading session failed:', error);
    },
  });
};
