import { useQuery } from '@tanstack/react-query';
import {
  classroomsControllerFindAll,
  classroomsControllerFindOne
} from '../api/requests';
import { queryKeys } from '../api/apiUtils';

// =============================================================================
// CLASSROOM QUERIES - Data Fetching Hooks
// =============================================================================

export const useClassrooms = () => {
  return useQuery({
    queryKey: queryKeys.classrooms.list(),
    queryFn: async () => {
      const res = await classroomsControllerFindAll();
      return res.data?.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useClassroomById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.classrooms.detail(id),
    queryFn: async () => {
      const res = await classroomsControllerFindOne({ path: { id } });
      return res.data?.data;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
