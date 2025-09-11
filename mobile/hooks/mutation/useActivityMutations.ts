import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, setupAuthToken } from '../api/apiUtils';
import {
  ActivitiesService,
  type DeleteClassroomsByClassroomIdActivityByActivityIdData,
  type PatchClassroomsByClassroomIdActivityByActivityIdData,
  type PostClassroomsByClassroomIdActivityData,
} from '../api/requests';

// =============================================================================
// ACTIVITY MUTATIONS - Data Modification Hooks
// =============================================================================

export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PostClassroomsByClassroomIdActivityData) => {
      await setupAuthToken();
      return ActivitiesService.postClassroomsByClassroomIdActivity(data);
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
    mutationFn: async (
      data: PatchClassroomsByClassroomIdActivityByActivityIdData,
    ) => {
      await setupAuthToken();
      return ActivitiesService.patchClassroomsByClassroomIdActivityByActivityId(
        data,
      );
    },
    onSuccess: (data, variables) => {
      // Update the specific activity in cache if we have classroom ID
      const classroomId = (variables as any).classroomId;
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
    mutationFn: async (
      data: DeleteClassroomsByClassroomIdActivityByActivityIdData,
    ) => {
      await setupAuthToken();
      return ActivitiesService.deleteClassroomsByClassroomIdActivityByActivityId(
        data,
      );
    },
    onSuccess: (_, variables) => {
      if (classroomId) {
        // Invalidate activities list for the classroom
        queryClient.invalidateQueries({
          queryKey: queryKeys.activities.byClassroom(classroomId),
        });
        // Remove the specific activity from cache
        queryClient.removeQueries({
          queryKey: queryKeys.activities.detail(
            classroomId,
            variables.activityId,
          ),
        });
        // Also invalidate classroom details as it might show activity count
        queryClient.invalidateQueries({
          queryKey: queryKeys.classrooms.detail(classroomId),
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
