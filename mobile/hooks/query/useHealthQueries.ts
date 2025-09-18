import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../api/apiUtils';
// Note: Health endpoints may not be available in hey-api generated code

// =============================================================================
// HEALTH QUERIES - Server Status & Health Check Hooks
// =============================================================================

// TODO: Migrate health endpoints when they become available in hey-api generated code
// These functions are temporarily disabled due to missing controller endpoints

export const useServerRoot = () => {
  return useQuery({
    queryKey: queryKeys.health.root(),
    queryFn: () => {
      // Health endpoint not available in hey-api generated code
      return Promise.resolve({ status: 'unavailable' });
    },
    staleTime: 30 * 1000, // 30 seconds
    retry: false, // Don't retry since endpoint is unavailable
    enabled: false, // Disable until proper endpoint is available
  });
};

export const useServerHealth = () => {
  return useQuery({
    queryKey: queryKeys.health.status(),
    queryFn: () => {
      // Health endpoint not available in hey-api generated code
      return Promise.resolve({ status: 'unavailable' });
    },
    staleTime: 10 * 1000, // 10 seconds
    retry: false, // Don't retry since endpoint is unavailable
    enabled: false, // Disable until proper endpoint is available
  });
};