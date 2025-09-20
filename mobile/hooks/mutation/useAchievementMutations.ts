import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, setupAuthToken } from '../api/apiUtils';
import {
  achievementsControllerAddPupilAchievement,
  achievementsControllerRemove,
  achievementsControllerRemovePupilAchievement,
} from '../api/requests';

// =============================================================================
// ACHIEVEMENT MUTATIONS - Data Modification Hooks
// =============================================================================

export const useAddPupilAchievement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { pupilId: string; achievementName: string }) => {
      await setupAuthToken();
      const res = await achievementsControllerAddPupilAchievement({
        path: { pupilId: data.pupilId, achievementName: data.achievementName },
      });
      return res.data?.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate achievements list and specific pupil achievements
      queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.achievements.byPupil(variables.pupilId),
      });
      // Also invalidate pupil leaderboard data as achievements might affect rankings
      queryClient.invalidateQueries({
        queryKey: queryKeys.pupils.leaderboard(),
      });
    },
    onError: (error: any) => {
      console.error('Add pupil achievement failed:', error);
    },
  });
};

export const useRemovePupilAchievement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { pupilId: string; achievementId: string }) => {
      await setupAuthToken();
      const res = await achievementsControllerRemovePupilAchievement({
        path: { pupilId: data.pupilId, achievementId: data.achievementId },
      });
      return res.data?.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate achievements list and specific pupil achievements
      queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.achievements.byPupil(variables.pupilId),
      });
      // Also invalidate pupil leaderboard data as achievements might affect rankings
      queryClient.invalidateQueries({
        queryKey: queryKeys.pupils.leaderboard(),
      });
    },
    onError: (error: any) => {
      console.error('Remove pupil achievement failed:', error);
    },
  });
};

export const useDeleteAchievement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string }) => {
      await setupAuthToken();
      const res = await achievementsControllerRemove({
        path: { id: data.id },
      });
      return res.data?.data;
    },
    onSuccess: () => {
      // Invalidate all achievement-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all });
      // Also invalidate pupil leaderboard data as achievements might affect rankings
      queryClient.invalidateQueries({
        queryKey: queryKeys.pupils.leaderboard(),
      });
    },
    onError: (error: any) => {
      console.error('Delete achievement failed:', error);
    },
  });
};
