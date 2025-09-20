import { useQuery } from '@tanstack/react-query';
import {
  pupilsControllerGetPupilProfile,
  pupilsControllerGetGlobalPupilLeaderboard,
  pupilsControllerGetPupilLeaderBoardByPupilId,
  pupilsControllerGetPupilByUsername,
} from '../api/requests';
import { setupAuthToken, queryKeys } from '../api/apiUtils';

// =============================================================================
// PUPIL QUERIES - Data Fetching Hooks
// =============================================================================

export const usePupilMe = () => {
  return useQuery({
    queryKey: queryKeys.pupils.me(),
    queryFn: async () => {
      await setupAuthToken();
      const res = await pupilsControllerGetPupilProfile();
      return res.data?.data;
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
      const res = await pupilsControllerGetGlobalPupilLeaderboard();
      return res.data?.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const usePupilLeaderboardById = (pupilId: string) => {
  return useQuery({
    queryKey: queryKeys.pupils.leaderboardById(pupilId),
    queryFn: async () => {
      await setupAuthToken();
      const res = await pupilsControllerGetPupilLeaderBoardByPupilId({
        path: { pupilId }
      });
      return res.data?.data;
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
      const res = await pupilsControllerGetPupilByUsername({
        path: { username }
      });
      return res.data?.data;
    },
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};