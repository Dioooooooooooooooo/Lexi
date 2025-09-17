import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, setupAuthToken } from '../api/apiUtils';
import {
  classroomsControllerCreate,
  classroomsControllerRemove,
  classroomsControllerUpdate,
} from '../api/requests';

// =============================================================================
// CLASSROOM MUTATIONS - Data Modification Hooks
// =============================================================================

export const useCreateClassroom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      await setupAuthToken();
      return classroomsControllerCreate({
        body: data,
      });
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
    mutationFn: async ({
      id,
      ...updateData
    }: {
      id: string;
      [key: string]: any;
    }) => {
      await setupAuthToken();
      return classroomsControllerUpdate({
        path: { id },
        body: updateData,
      });
    },
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
    mutationFn: async (id: string) => {
      await setupAuthToken();
      return classroomsControllerRemove({
        path: { id },
      });
    },
    onSuccess: () => {
      // Invalidate all classroom queries
      queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.all });
    },
    onError: (error: any) => {
      console.error('Failed to delete classroom:', error);
    },
  });
};
