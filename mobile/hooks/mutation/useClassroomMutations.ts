import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, setupAuthToken } from '../api/apiUtils';
import {
  classroomsControllerCreate,
  classroomsControllerRemove,
  classroomsControllerUpdate,
  classroomsControllerJoin,
} from '../api/requests';

// =============================================================================
// CLASSROOM MUTATIONS - Data Modification Hooks
// =============================================================================

export const useCreateClassroom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      await setupAuthToken();
      const res = await classroomsControllerCreate({
        body: data,
      });
      return res.data?.data;
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

export const useJoinClassroom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      await setupAuthToken();
      const res = await classroomsControllerJoin({
        body: data,
      });
      return res.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate classroom lists to refresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.list() });
    },
    onError: (error: any) => {
      console.error('Failed to update classroom:', error);
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
      const res = await classroomsControllerUpdate({
        path: { id },
        body: updateData,
      });
      return res.data?.data;
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
      const res = await classroomsControllerRemove({
        path: { id },
      });
      return res.data?.data;
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
