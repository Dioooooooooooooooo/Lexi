import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pupilsControllerUpdatePupilProfile } from '../api/requests';
import { setupAuthToken, queryKeys } from '../api/apiUtils';

// =============================================================================
// PUPIL MUTATIONS - Data Modification Hooks
// =============================================================================

export const useUpdatePupilProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      await setupAuthToken();
      const res = await pupilsControllerUpdatePupilProfile({
        body: data
      });
      return res.data?.data;
    },
    onSuccess: data => {
      // Update pupil profile in cache
      queryClient.setQueryData(queryKeys.pupils.me(), data);
    },
    onError: (error: any) => {
      console.error('Pupil profile update failed:', error);
    },
  });
};
