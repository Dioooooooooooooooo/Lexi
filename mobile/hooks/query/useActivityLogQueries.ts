import { useQuery } from '@tanstack/react-query';
import { queryKeys, setupAuthToken } from '../api/apiUtils';
import {
  activityLogsControllerFindOne,
  activityLogsControllerFindAll,
} from '../api/requests';

// =============================================================================
// ACTIVITY LOG QUERIES - Data Fetching Hooks
// =============================================================================

export const useActivityLogsByActivityId = (activityId: string) => {
  return useQuery({
    queryKey: [...queryKeys.activityLogs.all, 'by-activity', activityId] as const,
    queryFn: async () => {
      await setupAuthToken();
      const res = await activityLogsControllerFindOne({
        path: { activityId }
      });
      return res.data?.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: (failureCount, error: any) => {
      if (error?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    enabled: !!activityId, // Only run query if activityId is provided
  });
};

export const useActivityLogsByClassroom = (classroomId: string, activityId: string) => {
  return useQuery({
    queryKey: [...queryKeys.activityLogs.all, 'by-classroom', classroomId] as const,
    queryFn: async () => {
      await setupAuthToken();
      const res = await activityLogsControllerFindAll({
        path: { classroomId, activityId }
      });
      return res.data?.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: (failureCount, error: any) => {
      if (error?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    enabled: !!(classroomId && activityId), // Only run query if both IDs are provided
  });
};