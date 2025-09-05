import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ClassroomsService,
  type PostClassroomsData,
  type PatchClassroomsByIdData,
} from './requests';
import { setupAuthToken, queryKeys } from './apiUtils';

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
    mutationFn: (data: PatchClassroomsByIdData) =>
      ClassroomsService.patchClassroomsById(data),
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
