import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  AchievementsService,
  type PostAchievementsPupilByPupilIdAchievementByAchievementNameData,
  type DeleteAchievementsPupilsByPupilIdAchievementsByAchievementIdData,
  type DeleteAchievementsByIdData,
} from '../api/requests';
import { setupAuthToken, queryKeys } from '../api/apiUtils';

// =============================================================================
// ACHIEVEMENT MUTATIONS - Data Modification Hooks
// =============================================================================

export const useAddPupilAchievement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PostAchievementsPupilByPupilIdAchievementByAchievementNameData) => {
      await setupAuthToken();
      return AchievementsService.postAchievementsPupilByPupilIdAchievementByAchievementName(data);
    },
    onSuccess: (_, variables) => {
      // Invalidate achievements list and specific pupil achievements
      queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.achievements.byPupil(variables.pupilId) 
      });
      // Also invalidate pupil leaderboard data as achievements might affect rankings
      queryClient.invalidateQueries({ queryKey: queryKeys.pupils.leaderboard() });
    },
    onError: (error: any) => {
      console.error('Add pupil achievement failed:', error);
    },
  });
};

export const useRemovePupilAchievement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: DeleteAchievementsPupilsByPupilIdAchievementsByAchievementIdData) => {
      await setupAuthToken();
      return AchievementsService.deleteAchievementsPupilsByPupilIdAchievementsByAchievementId(data);
    },
    onSuccess: (_, variables) => {
      // Invalidate achievements list and specific pupil achievements
      queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.achievements.byPupil(variables.pupilId) 
      });
      // Also invalidate pupil leaderboard data as achievements might affect rankings
      queryClient.invalidateQueries({ queryKey: queryKeys.pupils.leaderboard() });
    },
    onError: (error: any) => {
      console.error('Remove pupil achievement failed:', error);
    },
  });
};

export const useDeleteAchievement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: DeleteAchievementsByIdData) => {
      await setupAuthToken();
      return AchievementsService.deleteAchievementsById(data);
    },
    onSuccess: () => {
      // Invalidate all achievement-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all });
      // Also invalidate pupil leaderboard data as achievements might affect rankings
      queryClient.invalidateQueries({ queryKey: queryKeys.pupils.leaderboard() });
    },
    onError: (error: any) => {
      console.error('Delete achievement failed:', error);
    },
  });
};