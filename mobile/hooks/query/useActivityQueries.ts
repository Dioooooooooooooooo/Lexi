import { useQuery } from '@tanstack/react-query';
import {
  activityControllerFindAllByClassroomId,
  activityControllerFindOne
} from '../api/requests';
import { setupAuthToken, queryKeys } from '../api/apiUtils';

// =============================================================================
// ACTIVITY QUERIES - Data Fetching Hooks
// =============================================================================

export const useActivitiesByClassroom = (classroomId: string) => {
  return useQuery({
    queryKey: queryKeys.activities.byClassroom(classroomId),
    queryFn: async () => {
      await setupAuthToken();
      const res = await activityControllerFindAllByClassroomId({
        path: { classroomId }
      });
      return res.data?.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error: any) => {
      if (error?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    enabled: !!classroomId, // Only run query if classroomId is provided
  });
};

export const useActivityById = (classroomId: string, activityId: string) => {
  return useQuery({
    queryKey: queryKeys.activities.detail(classroomId, activityId),
    queryFn: async () => {
      await setupAuthToken();
      const res = await activityControllerFindOne({
        path: { classroomId, activityId }
      });
      return res.data?.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    enabled: !!(classroomId && activityId), // Only run query if both IDs are provided
  });
};