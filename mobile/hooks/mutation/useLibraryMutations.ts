import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, setupAuthToken } from '../api/apiUtils';
import {
  libraryEntriesControllerCreate,
  libraryEntriesControllerRemove,
} from '../api/requests';

// =============================================================================
// USER MUTATIONS - Data Modification Hooks
// =============================================================================

export const useAddToLibrary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (readingMaterialId: string) => {
      await setupAuthToken();
      const res = await libraryEntriesControllerCreate({
        path: { readingMaterialId: readingMaterialId },
      });

      console.log(res);
      return res.data?.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.library.all,
      });
    },
    onError: (error: any) => {
      console.error('Failed to add to library:', error);
    },
  });
};

export const useRemoveFromLibrary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (readingMaterialId: string) => {
      await setupAuthToken();
      const res = await libraryEntriesControllerRemove({
        path: { readingMaterialId: readingMaterialId },
      });
      console.log(res);
      return res.data;
    },
    onSuccess() {
      queryClient.removeQueries({ queryKey: queryKeys.library.all });
    },
    onError: (error: any) => {
      console.error('Removing story from library failed: ', error);
    },
  });
};

