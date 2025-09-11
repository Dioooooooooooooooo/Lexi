import { useQuery } from '@tanstack/react-query';
import { queryKeys, setupAuthToken } from '../api/apiUtils';
import { ReadingMaterialsService } from '../api/requests';

// =============================================================================
// READING MATERIAL QUERIES - Data Fetching Hooks
// =============================================================================

export const useReadingMaterials = () => {
  return useQuery({
    queryKey: queryKeys.readingMaterials.list(),
    queryFn: async () => {
      await setupAuthToken();
      return ReadingMaterialsService.getReadingMaterials();
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

export const useReadingMaterialById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.readingMaterials.detail(id),
    queryFn: async () => {
      await setupAuthToken();
      return ReadingMaterialsService.getReadingMaterialsById({ id });
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      if (error?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    enabled: !!id, // Only run query if id is provided
  });
};

export const useReadingMaterialsRecommendations = () => {
  return useQuery({
    queryKey: queryKeys.readingMaterials.recommendations(),
    queryFn: async () => {
      await setupAuthToken();
      return ReadingMaterialsService.getReadingMaterialsRecommendations();
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