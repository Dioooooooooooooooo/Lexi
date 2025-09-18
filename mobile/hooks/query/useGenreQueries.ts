import { useQuery } from '@tanstack/react-query';
import { queryKeys, setupAuthToken } from '../api/apiUtils';
import { genresControllerFindAll } from '../api/requests';

// =============================================================================
// GENRE QUERIES - Data Fetching Hooks
// =============================================================================

export const useGenres = () => {
  return useQuery({
    queryKey: queryKeys.genres.list(),
    queryFn: async () => {
      await setupAuthToken();
      const res = await genresControllerFindAll();
      return res.data?.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - genres don't change often
    retry: (failureCount, error: any) => {
      if (error?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};
