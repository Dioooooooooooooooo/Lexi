import { useQuery } from '@tanstack/react-query';
import { queryKeys, setupAuthToken } from '../api/apiUtils';
import { ReadingSessionsService } from '../api/requests';

// =============================================================================
// READING SESSION QUERIES - Data Fetching Hooks
// =============================================================================

export const useReadingSessions = () => {
  return useQuery({
    queryKey: queryKeys.readingSessions.list(),
    queryFn: async () => {
      await setupAuthToken();
      return ReadingSessionsService.getReadingSessions();
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

export const useReadingSessionById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.readingSessions.detail(id),
    queryFn: async () => {
      await setupAuthToken();
      return ReadingSessionsService.getReadingSessionsById({ id });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    enabled: !!id, // Only run query if id is provided
  });
};