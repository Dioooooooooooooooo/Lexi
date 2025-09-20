import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, setupAuthToken } from '../api/apiUtils';
import {
  activityControllerCreate,
  activityControllerUpdate,
  activityControllerRemove,
} from '../api/requests';

// =============================================================================
// ACTIVITY MUTATIONS - Data Modification Hooks
// =============================================================================

export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { classroomId: string; body: any }) => {
      await setupAuthToken();
      const res = await activityControllerCreate({
        path: { classroomId: data.classroomId },
        body: data.body
      });
      return res.data?.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate activities list for the classroom
      queryClient.invalidateQueries({
        queryKey: queryKeys.activities.byClassroom(variables.classroomId),
      });
      // Also invalidate classroom details as it might show activity count
      queryClient.invalidateQueries({
        queryKey: queryKeys.classrooms.detail(variables.classroomId),
      });
    },
    onError: (error: any) => {
      console.error('Create activity failed:', error);
    },
  });
};

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { classroomId: string; activityId: string; body: any }) => {
      await setupAuthToken();
      const res = await activityControllerUpdate({
        path: { classroomId: data.classroomId, activityId: data.activityId },
        body: data.body
      });
      return res.data?.data;
    },
    onSuccess: (data, variables) => {
      // Update the specific activity in cache if we have classroom ID
      const classroomId = variables.classroomId;
      if (classroomId) {
        queryClient.setQueryData(
          queryKeys.activities.detail(classroomId, variables.activityId),
          data,
        );
        // Invalidate activities list for the classroom
        queryClient.invalidateQueries({
          queryKey: queryKeys.activities.byClassroom(classroomId),
        });
      } else {
        // If we don't have classroomId, invalidate all activities
        queryClient.invalidateQueries({ queryKey: queryKeys.activities.all });
      }
    },
    onError: (error: any) => {
      console.error('Update activity failed:', error);
    },
  });
};

export const useDeleteActivity = (classroomId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { classroomId: string; activityId: string }) => {
      await setupAuthToken();
      const res = await activityControllerRemove({
        path: { classroomId: data.classroomId, activityId: data.activityId }
      });
      return res.data?.data;
    },
    onSuccess: (_, variables) => {
      const resolvedClassroomId = classroomId || variables.classroomId;
      if (resolvedClassroomId) {
        // Invalidate activities list for the classroom
        queryClient.invalidateQueries({
          queryKey: queryKeys.activities.byClassroom(resolvedClassroomId),
        });
        // Remove the specific activity from cache
        queryClient.removeQueries({
          queryKey: queryKeys.activities.detail(
            resolvedClassroomId,
            variables.activityId,
          ),
        });
        // Also invalidate classroom details as it might show activity count
        queryClient.invalidateQueries({
          queryKey: queryKeys.classrooms.detail(resolvedClassroomId),
        });
      } else {
        // If we don't have classroomId, invalidate all activities
        queryClient.invalidateQueries({ queryKey: queryKeys.activities.all });
      }
    },
    onError: (error: any) => {
      console.error('Delete activity failed:', error);
    },
  });
};
