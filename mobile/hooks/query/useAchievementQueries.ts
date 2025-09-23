import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  achievementsControllerGetPupilAchievements,
  achievementsControllerGetPupilAchievementsById,
} from '../api/requests';
import { setupAuthToken, queryKeys } from '../api/apiUtils';
import { Achievement } from '@/models/Achievement';

// =============================================================================
// ACHIEVEMENT QUERIES - Data Fetching Hooks
// =============================================================================

export const useAchievements = (options?: Partial<UseQueryOptions<Achievement[]>>) => {
  return useQuery({
    queryKey: queryKeys.achievements.list(),
    queryFn: async () => {
      await setupAuthToken();
      const res = await achievementsControllerGetPupilAchievements();
      if (Array.isArray(res.data?.data)) {
        return res.data.data as Achievement[];
      }

      return [] as Achievement[];
    },
    staleTime: 1 * 60 * 1000, // 1 minutes
    retry: (failureCount, error: any) => {
      if (error?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    ...options
  });
};

export const useAchievementsByPupil = (pupilId: string) => {
  return useQuery({
    queryKey: queryKeys.achievements.byPupil(pupilId),
    queryFn: async () => {
      await setupAuthToken();
      const res = await achievementsControllerGetPupilAchievementsById({
        path: { pupilId },
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
