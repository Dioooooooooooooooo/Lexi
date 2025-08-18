import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api/client';
import { Classroom } from '../models/Classroom';
import { User } from '../models/User';
import { ReadingMaterialAssignment } from '../models/ReadingMaterialAssignment';
import { ReadingAssignmentLog } from '../models/ReadingAssignmentLog';

// Types
export interface CreateClassroomData {
  name: string;
  description?: string;
  grade_level?: string;
  subject?: string;
}

export interface EditClassroomData {
  id: string;
  name?: string;
  description?: string;
  grade_level?: string;
  subject?: string;
}

export interface CreateReadingAssignmentData {
  classroomId: string;
  title: string;
  description?: string;
  reading_material_url: string;
  due_date?: string;
  assigned_pupils?: string[];
}

export interface AssignmentLogData {
  reading_assignment_id: string;
  pupil_id: string;
  time_spent: number;
  progress_percentage: number;
  completed: boolean;
}

// Query Keys
export const CLASSROOM_KEYS = {
  all: ['classrooms'] as const,
  lists: () => [...CLASSROOM_KEYS.all, 'list'] as const,
  list: (filters: string) => [...CLASSROOM_KEYS.lists(), { filters }] as const,
  details: () => [...CLASSROOM_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...CLASSROOM_KEYS.details(), id] as const,
  pupils: (id: string) => [...CLASSROOM_KEYS.detail(id), 'pupils'] as const,
  assignments: (id: string) => [...CLASSROOM_KEYS.detail(id), 'assignments'] as const,
  leaderboard: (id: string) => [...CLASSROOM_KEYS.detail(id), 'leaderboard'] as const,
  search: (query: string) => [...CLASSROOM_KEYS.all, 'search', query] as const,
} as const;

// API Functions
const classroomApi = {
  getByRole: async (role: string): Promise<Classroom[]> => {
    return apiClient.get(`/classrooms/by-role/${role}`);
  },

  create: async (data: CreateClassroomData): Promise<Classroom> => {
    return apiClient.post('/classrooms', data);
  },

  update: async (data: EditClassroomData): Promise<Classroom> => {
    const { id, ...updateData } = data;
    return apiClient.patch(`/classrooms/${id}`, updateData);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/classrooms/${id}`);
  },

  join: async (joinCode: string): Promise<Classroom> => {
    return apiClient.post('/classrooms/join', { join_code: joinCode });
  },

  leave: async (id: string): Promise<void> => {
    return apiClient.delete(`/classrooms/${id}/leave`);
  },

  searchPupils: async (query: string): Promise<User[]> => {
    return apiClient.get('/pupils/search', { q: query });
  },

  getPupils: async (id: string): Promise<User[]> => {
    return apiClient.get(`/classrooms/${id}/pupils`);
  },

  addPupil: async (classroomId: string, pupilId: string): Promise<void> => {
    return apiClient.post(`/classrooms/${classroomId}/pupils`, { pupil_id: pupilId });
  },

  removePupil: async (classroomId: string, pupilId: string): Promise<void> => {
    return apiClient.delete(`/classrooms/${classroomId}/pupils/${pupilId}`);
  },

  getAssignments: async (id: string): Promise<ReadingMaterialAssignment[]> => {
    return apiClient.get(`/classrooms/${id}/assignments`);
  },

  createAssignment: async (data: CreateReadingAssignmentData): Promise<ReadingMaterialAssignment> => {
    return apiClient.post('/reading-assignments', data);
  },

  getLeaderboard: async (id: string): Promise<any[]> => {
    return apiClient.get(`/classrooms/${id}/leaderboard`);
  },

  createAssignmentLog: async (data: AssignmentLogData): Promise<ReadingAssignmentLog> => {
    return apiClient.post('/reading-assignment-logs', data);
  },

  getAssignmentLogs: async (assignmentId: string): Promise<ReadingAssignmentLog[]> => {
    return apiClient.get(`/reading-assignments/${assignmentId}/logs`);
  },
};

// Query Hooks

export const useGetClassroomsByRole = (role: string) => {
  return useQuery({
    queryKey: CLASSROOM_KEYS.list(role),
    queryFn: () => classroomApi.getByRole(role),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!role,
  });
};

export const usePupilsFromClassroom = (classroom: Classroom) => {
  return useQuery({
    queryKey: CLASSROOM_KEYS.pupils(classroom.id),
    queryFn: () => classroomApi.getPupils(classroom.id),
    enabled: !!classroom.id,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const usePupilsFromClassroomCount = (classroom: Classroom) => {
  const { data } = usePupilsFromClassroom(classroom);
  return { data: data?.length || 0 };
};

export const useActiveReadingAssignments = (classroomId: string) => {
  return useQuery({
    queryKey: CLASSROOM_KEYS.assignments(classroomId),
    queryFn: () => classroomApi.getAssignments(classroomId),
    enabled: !!classroomId,
    staleTime: 30 * 1000, // 30 seconds for active assignments
  });
};

export const useGetLeaderboardByClassroomId = (classroomId: string) => {
  return useQuery({
    queryKey: CLASSROOM_KEYS.leaderboard(classroomId),
    queryFn: () => classroomApi.getLeaderboard(classroomId),
    enabled: !!classroomId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useReadingAssignmentsWStats = (classroomId: string) => {
  return useQuery({
    queryKey: [...CLASSROOM_KEYS.assignments(classroomId), 'with-stats'],
    queryFn: () => apiClient.get(`/classrooms/${classroomId}/assignments/stats`),
    enabled: !!classroomId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useGetReadingAssignmentLogs = (readingAssignmentId: string) => {
  return useQuery({
    queryKey: ['reading-assignment-logs', readingAssignmentId],
    queryFn: () => classroomApi.getAssignmentLogs(readingAssignmentId),
    enabled: !!readingAssignmentId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useSearchPupils = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: CLASSROOM_KEYS.search(query),
    queryFn: () => classroomApi.searchPupils(query),
    enabled: enabled && query.length >= 2, // Only search with 2+ characters
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutation Hooks

export const useCreateClassroom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: classroomApi.create,
    onSuccess: () => {
      // Invalidate and refetch classrooms
      queryClient.invalidateQueries({ queryKey: CLASSROOM_KEYS.lists() });
    },
    onError: (error: any) => {
      console.error('Failed to create classroom:', error);
    },
  });
};

export const useEditClassroom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: classroomApi.update,
    onSuccess: (data) => {
      // Update the classroom in cache
      queryClient.setQueryData(CLASSROOM_KEYS.detail(data.id), data);
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: CLASSROOM_KEYS.lists() });
    },
    onError: (error: any) => {
      console.error('Failed to edit classroom:', error);
    },
  });
};

export const useDeleteClassroom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: classroomApi.delete,
    onSuccess: () => {
      // Invalidate all classroom queries
      queryClient.invalidateQueries({ queryKey: CLASSROOM_KEYS.all });
    },
    onError: (error: any) => {
      console.error('Failed to delete classroom:', error);
    },
  });
};

export const useJoinClassroom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: classroomApi.join,
    onSuccess: () => {
      // Invalidate classroom lists
      queryClient.invalidateQueries({ queryKey: CLASSROOM_KEYS.lists() });
    },
    onError: (error: any) => {
      console.error('Failed to join classroom:', error);
    },
  });
};

export const useLeaveClassroom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: classroomApi.leave,
    onSuccess: () => {
      // Invalidate classroom lists
      queryClient.invalidateQueries({ queryKey: CLASSROOM_KEYS.lists() });
    },
    onError: (error: any) => {
      console.error('Failed to leave classroom:', error);
    },
  });
};

export const useAddPupilToClassroom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classroomId, pupilId }: { classroomId: string; pupilId: string }) =>
      classroomApi.addPupil(classroomId, pupilId),
    onSuccess: (_, variables) => {
      // Invalidate pupils list for this classroom
      queryClient.invalidateQueries({ 
        queryKey: CLASSROOM_KEYS.pupils(variables.classroomId) 
      });
    },
    onError: (error: any) => {
      console.error('Failed to add pupil to classroom:', error);
    },
  });
};

export const useRemovePupilFromClassroom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classroomId, pupilId }: { classroomId: string; pupilId: string }) =>
      classroomApi.removePupil(classroomId, pupilId),
    onSuccess: (_, variables) => {
      // Invalidate pupils list for this classroom
      queryClient.invalidateQueries({ 
        queryKey: CLASSROOM_KEYS.pupils(variables.classroomId) 
      });
    },
    onError: (error: any) => {
      console.error('Failed to remove pupil from classroom:', error);
    },
  });
};

export const useCreateReadingAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: classroomApi.createAssignment,
    onSuccess: (_, variables) => {
      // Invalidate assignments for this classroom
      queryClient.invalidateQueries({ 
        queryKey: CLASSROOM_KEYS.assignments(variables.classroomId) 
      });
    },
    onError: (error: any) => {
      console.error('Failed to create reading assignment:', error);
    },
  });
};

export const useCreateAssignmentLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: classroomApi.createAssignmentLog,
    onSuccess: (_, variables) => {
      // Invalidate assignment logs
      queryClient.invalidateQueries({ 
        queryKey: ['reading-assignment-logs', variables.reading_assignment_id] 
      });
      
      // Also invalidate leaderboard as it may be affected
      // Note: We'd need the classroomId for this, might need to adjust the mutation
      queryClient.invalidateQueries({ 
        queryKey: CLASSROOM_KEYS.all
      });
    },
    onError: (error: any) => {
      console.error('Failed to create assignment log:', error);
    },
  });
};