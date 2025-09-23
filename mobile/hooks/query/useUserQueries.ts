import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { queryKeys, setupAuthToken } from '../api/apiUtils';
import {
  userControllerGetLoginStreak,
  userControllerGetTotalSessions,
  userControllerSearchUsers,
} from '../api/requests';
import { LoginStreak } from '@/models/LoginStreak';

// =============================================================================
// USER QUERIES - Data Fetching Hooks
// =============================================================================

export const useUserStreak = (options?: Partial<UseQueryOptions>) => {
  return useQuery({
    queryKey: [...queryKeys.user.all, 'streak'] as const,
    queryFn: async () => {
      await setupAuthToken();
      const res = await userControllerGetLoginStreak();
      return res.data?.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    ...options
  });
};

export const useUserSessions = (options?: Partial<UseQueryOptions>) => {
  return useQuery({
    queryKey: [...queryKeys.user.all, 'sessions'] as const,
    queryFn: async () => {
      await setupAuthToken();
      const res = await userControllerGetTotalSessions();
      return res.data?.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error: any) => {
      if (error?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    ...options
  });
};

export const useUserSearch = (searchData: { query: string; role?: string }) => {
  return useQuery({
    queryKey: [
      ...queryKeys.user.all,
      'search',
      searchData.query,
      searchData.role || 'all',
    ] as const,
    queryFn: async () => {
      await setupAuthToken();
      const res = await userControllerSearchUsers({
        query: { query: searchData.query, role: searchData.role || 'all' }
      });
      return res.data?.data;
    },
    staleTime: 30 * 1000, // 30 seconds
    retry: (failureCount, error: any) => {
      if (error?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    enabled: !!searchData.query, // Only run query if search query is provided
  });
};
