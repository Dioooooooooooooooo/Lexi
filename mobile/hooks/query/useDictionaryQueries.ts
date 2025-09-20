import { useQuery } from '@tanstack/react-query';
import { queryKeys, setupAuthToken } from '../api/apiUtils';
import { dictionaryControllerDefinition } from '../api/requests';

// =============================================================================
// DICTIONARY QUERIES - Data Fetching Hooks
// =============================================================================

export const useDictionaryDefinition = (word: string) => {
  return useQuery({
    queryKey: [...queryKeys.dictionary.all, 'definition', word] as const,
    queryFn: async () => {
      try {
        await setupAuthToken();
        const res = await dictionaryControllerDefinition({
          path: { word },
        });

        console.log('dictionary def', res.data);
        const defs = res.data.data as Array<{ shortdef?: string[] }>;
        return defs[0]?.shortdef?.[0] ?? '';
      } catch (err) {
        console.error('error fetching defintion', err);
        return [];
      }
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
