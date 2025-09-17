import { useQuery } from '@tanstack/react-query';
import { queryKeys, setupAuthToken } from '../api/apiUtils';
import { OpenAPI, ReadingMaterialsService } from '../api/requests';

// =============================================================================
// READING MATERIAL QUERIES - Data Fetching Hooks
// =============================================================================

export const useReadingMaterials = () => {
  return useQuery({
    queryKey: queryKeys.readingMaterials.list(),
    // queryFn: async () => {
    //   await setupAuthToken();
    //   return await ReadingMaterialsService.getReadingMaterials();
    // },
    queryFn: async () => {
      await setupAuthToken();
      console.log('debugging fucks');
      try {
        const res = await ReadingMaterialsService.getReadingMaterials();
        console.log('reading materials raw:', res.data[0]);
        return res;
      } catch (err) {
        console.error('reading materials error:', err);
        throw err; // rethrow so React Query sees it
      }
    },

    staleTime: 2 * 60 * 1000, // 2 minutes for quick debugging
    // retry: (failureCount, error: any) => {
    //   if (error?.status === 401) {
    //     return false;
    //   }
    //   return failureCount < 3;
    // },
    select: (response: any) => response.data,
    placeholderData: [],
  });
};

export const useReadingMaterialById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.readingMaterials.detail(id),
    queryFn: async () => {
      await setupAuthToken();
      return ReadingMaterialsService.getReadingMaterialsById({ id });
    },
    staleTime: 60 * 60 * 1000, // 10 minutes
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
