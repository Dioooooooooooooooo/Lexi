import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, setupAuthToken } from '../api/apiUtils';
import { ReadingMaterialsService, type PostReadingMaterialsData } from '../api/requests';

// =============================================================================
// READING MATERIAL MUTATIONS - Data Modification Hooks
// =============================================================================

export const useCreateReadingMaterial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PostReadingMaterialsData) => {
      await setupAuthToken();
      return ReadingMaterialsService.postReadingMaterials(data);
    },
    onSuccess: () => {
      // Invalidate reading materials list to refetch updated data
      queryClient.invalidateQueries({ queryKey: queryKeys.readingMaterials.list() });
      // Also invalidate recommendations as new material might affect them
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.readingMaterials.recommendations() 
      });
    },
    onError: (error: any) => {
      console.error('Create reading material failed:', error);
    },
  });
};