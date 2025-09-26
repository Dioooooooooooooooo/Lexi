import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, setupAuthToken } from '../api/apiUtils';
import {
  activityControllerCreate,
  activityControllerRemove,
  activityControllerUpdate,
  classroomsControllerCreate,
  classroomsControllerEnroll,
  classroomsControllerJoin,
  classroomsControllerLeave,
  classroomsControllerRemove,
  classroomsControllerUnEnroll,
  classroomsControllerUpdate,
} from '../api/requests';
import type { CreateActivityDto } from '../api/requests/types.gen';

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
    mutationFn: async (joinCode: string) => {
      await setupAuthToken();
      const res = await classroomsControllerJoin({
        body: { code: joinCode },
      });
      return res.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate classroom lists to refresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.list() });
    },
    onError: (error: any) => {
      console.error('Failed to join classroom:', error);
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

export const useEnrollPupils = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      await setupAuthToken();
      const res = await classroomsControllerEnroll({
        body: data,
      });
      return res.data?.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate classroom lists to refresh enrollment data
      queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.list() });
      // If classroomId is provided, invalidate specific classroom
      if (variables.classroomId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.classrooms.detail(variables.classroomId),
        });
      }
    },
    onError: (error: any) => {
      console.error('Failed to enroll pupils:', error);
    },
  });
};

export const useUnEnrollPupils = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      await setupAuthToken();
      const res = await classroomsControllerUnEnroll({
        body: data,
      });
      return res.data?.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate classroom lists to refresh enrollment data
      queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.list() });
      // If classroomId is provided, invalidate specific classroom
      if (variables.classroomId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.classrooms.detail(variables.classroomId),
        });
      }
    },
    onError: (error: any) => {
      console.error('Failed to unenroll pupils:', error);
    },
  });
};

export const useLeaveClassroom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { classroomId: string }) => {
      console.log('🔍 FRONTEND: Input data:', data);
      const payload = { classroom_id: data.classroomId };
      console.log('🔍 FRONTEND: Sending payload:', payload);

      await setupAuthToken();
      const res = await classroomsControllerLeave({
        body: payload,
      });

      console.log('🔍 FRONTEND: Response:', res);
      return res.data?.data;
    },
    onSuccess: () => {
      console.log('✅ Leave classroom successful');
      // Invalidate classroom lists since user left a classroom
      queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.list() });
    },
    onError: (error: any) => {
      console.error('❌ Failed to leave classroom:', error);
    },
  });
};

// =============================================================================
// CLASSROOM ACTIVITY MUTATIONS - Activity Management within Classrooms
// =============================================================================

export const useCreateClassroomActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classroomId,
      readingAssignmentForm,
    }: {
      classroomId: string;
      readingAssignmentForm: {
        title: string;
        description?: string;
        readingMaterialId?: string;
        minigameType?: any;
      };
    }) => {
      await setupAuthToken();
      const res = await activityControllerCreate({
        path: { classroomId },
        body: {
          title: readingAssignmentForm.title,
          description: readingAssignmentForm.description,
          reading_material_id: readingAssignmentForm.readingMaterialId || '',
        } as CreateActivityDto,
      });
      return res.data?.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate activities for this classroom using the correct query key
      queryClient.invalidateQueries({
        queryKey: queryKeys.activities.byClassroom(variables.classroomId),
      });
      // Also invalidate the classroom details in case it affects the classroom data
      queryClient.invalidateQueries({
        queryKey: queryKeys.classrooms.detail(variables.classroomId),
      });
    },
    onError: (error: any) => {
      console.error('Failed to create activity:', error);
    },
  });
};

export const useUpdateClassroomActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classroomId,
      activityId,
      ...updateData
    }: {
      classroomId: string;
      activityId: string;
      [key: string]: any;
    }) => {
      await setupAuthToken();
      const res = await activityControllerUpdate({
        path: { classroomId, activityId },
        body: updateData,
      });
      return res.data?.data;
    },
    onSuccess: (data, variables) => {
      // Update the activity in cache
      queryClient.setQueryData(
        queryKeys.activities.detail(
          variables.classroomId,
          variables.activityId,
        ),
        data,
      );
      // Invalidate activities list
      queryClient.invalidateQueries({
        queryKey: queryKeys.activities.byClassroom(variables.classroomId),
      });
    },
    onError: (error: any) => {
      console.error('Failed to update activity:', error);
    },
  });
};

export const useDeleteClassroomActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classroomId,
      activityId,
    }: {
      classroomId: string;
      activityId: string;
    }) => {
      await setupAuthToken();
      const res = await activityControllerRemove({
        path: { classroomId, activityId },
      });
      return res.data?.data;
    },
    onSuccess: (data, variables) => {
      // Remove the activity from cache
      queryClient.removeQueries({
        queryKey: queryKeys.activities.detail(
          variables.classroomId,
          variables.activityId,
        ),
      });
      // Invalidate activities list
      queryClient.invalidateQueries({
        queryKey: queryKeys.activities.byClassroom(variables.classroomId),
      });
    },
    onError: (error: any) => {
      console.error('Failed to delete activity:', error);
    },
  });
};
