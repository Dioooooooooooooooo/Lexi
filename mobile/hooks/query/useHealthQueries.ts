import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../api/apiUtils';
import { HealthService } from '../api/requests';

// =============================================================================
// HEALTH QUERIES - Server Status & Health Check Hooks
// =============================================================================

export const useServerRoot = () => {
  return useQuery({
    queryKey: queryKeys.health.root(),
    queryFn: () => HealthService.get(),
    staleTime: 30 * 1000, // 30 seconds
    retry: (failureCount, error: any) => {
      // Don't retry too much for health checks
      return failureCount < 2;
    },
  });
};

export const useServerHealth = () => {
  return useQuery({
    queryKey: queryKeys.health.status(),
    queryFn: () => HealthService.getHealth(),
    staleTime: 10 * 1000, // 10 seconds
    retry: (failureCount, error: any) => {
      // Don't retry too much for health checks
      return failureCount < 2;
    },
  });
};