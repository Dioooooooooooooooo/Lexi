import { useQuery } from '@tanstack/react-query';
import { AuthenticationService } from '../api/requests';
import { setupAuthToken, queryKeys } from '../api/apiUtils';

// =============================================================================
// AUTH QUERIES - Data Fetching Hooks
// =============================================================================

export const useAuthMe = () => {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      await setupAuthToken();
      return AuthenticationService.getAuthMe();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 (unauthorized)
      if (error?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useVerifyToken = () => {
  return useQuery({
    queryKey: queryKeys.auth.verifyToken(),
    queryFn: async () => {
      await setupAuthToken();
      return AuthenticationService.getAuthVerifyToken();
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: false, // Don't retry token verification
  });
};