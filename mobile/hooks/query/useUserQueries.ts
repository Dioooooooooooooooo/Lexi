import { useQuery } from '@tanstack/react-query';
import { queryKeys, setupAuthToken } from '../api/apiUtils';
import { UserService, type GetUserSearchData } from '../api/requests';

// =============================================================================
// USER QUERIES - Data Fetching Hooks
// =============================================================================

export const useUserStreak = () => {
  return useQuery({
    queryKey: [...queryKeys.user.all, 'streak'] as const,
    queryFn: async () => {
      await setupAuthToken();
      return UserService.getUserMeStreak();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useUserSessions = () => {
  return useQuery({
    queryKey: [...queryKeys.user.all, 'sessions'] as const,
    queryFn: async () => {
      await setupAuthToken();
      return UserService.getUserMeSessions();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error: any) => {
      if (error?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useUserSearch = (searchData: GetUserSearchData) => {
  return useQuery({
    queryKey: [
      ...queryKeys.user.all,
      'search',
      searchData.query,
      searchData.role || 'all',
    ] as const,
    queryFn: async () => {
      await setupAuthToken();
      return UserService.getUserSearch(searchData);
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
