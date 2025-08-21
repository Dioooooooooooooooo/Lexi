import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  PupilsService,
  type PatchPupilsMeData,
} from './requests';
import { setupAuthToken, queryKeys } from './apiUtils';

// =============================================================================
// PUPILS HOOKS  
// =============================================================================

export const usePupilMe = () => {
  return useQuery({
    queryKey: queryKeys.pupils.me(),
    queryFn: async () => {
      await setupAuthToken();
      return PupilsService.getPupilsMe();
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

export const useUpdatePupilProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PatchPupilsMeData) => {
      await setupAuthToken();
      return PupilsService.patchPupilsMe(data);
    },
    onSuccess: (data) => {
      // Update pupil profile in cache
      queryClient.setQueryData(queryKeys.pupils.me(), data);
    },
    onError: (error: any) => {
      console.error('Pupil profile update failed:', error);
    },
  });
};

export const usePupilsLeaderboard = () => {
  return useQuery({
    queryKey: queryKeys.pupils.leaderboard(),
    queryFn: async () => {
      await setupAuthToken();
      return PupilsService.getPupilsLeaderboard();
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const usePupilLeaderboardById = (pupilId: string) => {
  return useQuery({
    queryKey: queryKeys.pupils.leaderboardById(pupilId),
    queryFn: async () => {
      await setupAuthToken();
      return PupilsService.getPupilsLeaderboardByPupilId();
    },
    enabled: !!pupilId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const usePupilByUsername = (username: string) => {
  return useQuery({
    queryKey: queryKeys.pupils.byUsername(username),
    queryFn: async () => {
      await setupAuthToken();
      return PupilsService.getPupilsByUsername({ username });
    },
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};