import { useQuery } from '@tanstack/react-query';
import {
  classroomsControllerFindAll,
  classroomsControllerFindOne,
  activityControllerFindAllByClassroomId,
  activityControllerFindOne,
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

export const useClassroomActivities = (classroomId: string) => {
  return useQuery({
    queryKey: ['classrooms', classroomId, 'activities'],
    queryFn: async () => {
      const res = await activityControllerFindAllByClassroomId({ 
        path: { classroomId } 
      });
      return res.data?.data;
    },
    enabled: !!classroomId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useClassroomActivity = (classroomId: string, activityId: string) => {
  return useQuery({
    queryKey: ['classrooms', classroomId, 'activities', activityId],
    queryFn: async () => {
      const res = await activityControllerFindOne({ 
        path: { classroomId, activityId } 
      });
      return res.data?.data;
    },
    enabled: !!classroomId && !!activityId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
