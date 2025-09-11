import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, setupAuthToken } from '../api/apiUtils';
import {
  ActivityLogsService,
  type PostClassroomActivityLogsByActivityIdData,
} from '../api/requests';

// =============================================================================
// ACTIVITY LOG MUTATIONS - Data Modification Hooks
// =============================================================================

export const useCreateActivityLog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PostClassroomActivityLogsByActivityIdData) => {
      await setupAuthToken();
      return ActivityLogsService.postClassroomActivityLogsByActivityId(data);
    },
    onSuccess: (_, variables) => {
      // Invalidate activity logs for this specific activity
      queryClient.invalidateQueries({ 
        queryKey: [...queryKeys.activityLogs.all, 'by-activity', variables.activityId] 
      });
      // Also invalidate all activity logs list
      queryClient.invalidateQueries({ queryKey: queryKeys.activityLogs.list() });
    },
    onError: (error: any) => {
      console.error('Create activity log failed:', error);
    },
  });
};