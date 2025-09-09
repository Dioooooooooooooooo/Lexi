import { useQuery } from '@tanstack/react-query';
import { MinigamesService } from '../api/requests';
import { setupAuthToken, queryKeys } from '../api/apiUtils';

// =============================================================================
// MINIGAME QUERIES - Data Fetching Hooks
// =============================================================================

export const useRandomMinigamesByMaterial = (readingMaterialId: string) => {
  return useQuery({
    queryKey: queryKeys.minigames.randomByMaterial(readingMaterialId),
    queryFn: async () => {
      await setupAuthToken();
      return MinigamesService.getMinigamesReadingmaterialsByReadingMaterialIdRandom({ readingMaterialId });
    },
    enabled: !!readingMaterialId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRandomMinigamesBySession = (readingSessionId: string) => {
  return useQuery({
    queryKey: queryKeys.minigames.randomBySession(readingSessionId),
    queryFn: async () => {
      await setupAuthToken();
      return MinigamesService.getMinigamesByReadingSessionIdRandom({ readingSessionId });
    },
    enabled: !!readingSessionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useWordsFromLettersMinigame = (readingMaterialId: string) => {
  return useQuery({
    queryKey: queryKeys.minigames.wordsFromLetters(readingMaterialId),
    queryFn: async () => {
      await setupAuthToken();
      return MinigamesService.getMinigamesByReadingMaterialIdWordsFromLetters({ readingMaterialId });
    },
    enabled: !!readingMaterialId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};