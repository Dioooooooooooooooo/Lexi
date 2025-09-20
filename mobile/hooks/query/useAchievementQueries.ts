import { useQuery } from '@tanstack/react-query';
import {
  achievementsControllerGetPupilAchievements,
  achievementsControllerGetPupilAchievementsById
} from '../api/requests';
import { setupAuthToken, queryKeys } from '../api/apiUtils';

// =============================================================================
// ACHIEVEMENT QUERIES - Data Fetching Hooks
// =============================================================================

export const useAchievements = () => {
  return useQuery({
    queryKey: queryKeys.achievements.list(),
    queryFn: async () => {
      await setupAuthToken();
      const res = await achievementsControllerGetPupilAchievements();
      return res.data?.data;
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

export const useAchievementsByPupil = (pupilId: string) => {
  return useQuery({
    queryKey: queryKeys.achievements.byPupil(pupilId),
    queryFn: async () => {
      await setupAuthToken();
      const res = await achievementsControllerGetPupilAchievementsById({
        path: { pupilId }
      });
      return res.data?.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error: any) => {
      if (error?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    enabled: !!pupilId, // Only run query if pupilId is provided
  });
};