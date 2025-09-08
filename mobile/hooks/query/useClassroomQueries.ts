import { useQuery } from '@tanstack/react-query';
import { ClassroomsService } from '../api/requests';
import { queryKeys } from '../api/apiUtils';

// =============================================================================
// CLASSROOM QUERIES - Data Fetching Hooks
// =============================================================================

export const useClassrooms = () => {
  return useQuery({
    queryKey: queryKeys.classrooms.list(),
    queryFn: () => ClassroomsService.getClassrooms(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useClassroomById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.classrooms.detail(id),
    queryFn: () => ClassroomsService.getClassroomsById({ id }),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};