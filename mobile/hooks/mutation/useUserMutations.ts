import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, setupAuthToken } from '../api/apiUtils';
import {
  userControllerUpdateLoginStreak,
  userControllerCreateSession,
  userControllerEndSession,
} from '../api/requests';

// =============================================================================
// USER MUTATIONS - Data Modification Hooks
// =============================================================================

export const useUpdateUserStreak = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      await setupAuthToken();
      const res = await userControllerUpdateLoginStreak();
      return res.data?.data;
    },
    onSuccess: (data) => {
      // Update streak in cache
      queryClient.setQueryData([...queryKeys.user.all, 'streak'], data);
      // Also invalidate user profile data as it might include streak info
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
    },
    onError: (error: any) => {
      console.error('Update user streak failed:', error);
    },
  });
};

export const useCreateUserSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      await setupAuthToken();
      const res = await userControllerCreateSession();
      return res.data?.data;
    },
    onSuccess: () => {
      // Invalidate user sessions list to refetch updated data
      queryClient.invalidateQueries({ 
        queryKey: [...queryKeys.user.all, 'sessions'] 
      });
    },
    onError: (error: any) => {
      console.error('Create user session failed:', error);
    },
  });
};

export const useUpdateUserSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { sessionId: string }) => {
      await setupAuthToken();
      const res = await userControllerEndSession({
        path: { sessionId: data.sessionId }
      });
      return res.data?.data;
    },
    onSuccess: () => {
      // Invalidate user sessions list to refetch updated data
      queryClient.invalidateQueries({ 
        queryKey: [...queryKeys.user.all, 'sessions'] 
      });
    },
    onError: (error: any) => {
      console.error('Update user session failed:', error);
    },
  });
};