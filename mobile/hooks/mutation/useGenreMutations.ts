import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, setupAuthToken } from '../api/apiUtils';
import { GenresService, type PostGenresData } from '../api/requests';

// =============================================================================
// GENRE MUTATIONS - Data Modification Hooks
// =============================================================================

export const useCreateGenre = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PostGenresData) => {
      await setupAuthToken();
      return GenresService.postGenres(data);
    },
    onSuccess: () => {
      // Invalidate genres list to refetch updated data
      queryClient.invalidateQueries({ queryKey: queryKeys.genres.list() });
    },
    onError: (error: any) => {
      console.error('Create genre failed:', error);
    },
  });
};