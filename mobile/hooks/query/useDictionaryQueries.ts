import { useQuery } from '@tanstack/react-query';
import { queryKeys, setupAuthToken } from '../api/apiUtils';
import { DictionaryService, type GetDictionaryDictionaryByWordData } from '../api/requests';

// =============================================================================
// DICTIONARY QUERIES - Data Fetching Hooks
// =============================================================================

export const useDictionaryDefinition = (word: string) => {
  return useQuery({
    queryKey: [...queryKeys.dictionary.all, 'definition', word] as const,
    queryFn: async () => {
      await setupAuthToken();
      return DictionaryService.getDictionaryDictionaryByWord({ word });
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - definitions don't change often
    retry: (failureCount, error: any) => {
      if (error?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    enabled: !!word && word.length > 0, // Only run query if word is provided
  });
};