import { useQuery } from '@tanstack/react-query';
import { PupilsService } from '../api/requests';
import { setupAuthToken, queryKeys } from '../api/apiUtils';

// =============================================================================
// PUPIL QUERIES - Data Fetching Hooks
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