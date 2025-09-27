import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { libraryEntriesControllerFindAll } from '../api/requests';
import { setupAuthToken, queryKeys } from '../api/apiUtils';
import { ReadingMaterial } from '@/models/ReadingMaterial';

// =============================================================================
// LIBRARY QUERIES - Data Fetching Hooks
// =============================================================================
export const useLibraryStories = () => {
  return useQuery({
    queryKey: [...queryKeys.library.all, 'library-stories'] as const,
    queryFn: async () => {
      await setupAuthToken();
      const res = await libraryEntriesControllerFindAll();
      console.log('Library: ', res);

      if (Array.isArray(res.data?.data)) {
        return res.data?.data as ReadingMaterial[];
      }

      return [] as ReadingMaterial[];
    },
    staleTime: 1 * 60 * 1000,
    retry: (failureCount, error: any) => {
      return failureCount < 3;
    },
  });
};

