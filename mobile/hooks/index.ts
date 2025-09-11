// Export all API hooks organized by service

// Health hooks
export * from './query/useHealthQueries';

// Auth hooks
export * from './query/useAuthQueries';
export * from './mutation/useAuthMutations';

// Pupil hooks  
export * from './query/usePupilQueries';
export * from './mutation/usePupilMutations';

// Classroom hooks
export * from './query/useClassroomQueries';
export * from './mutation/useClassroomMutations';

// Minigame hooks
export * from './query/useMinigameQueries';
export * from './mutation/useMinigameMutations';

// Achievement hooks
export * from './query/useAchievementQueries';
export * from './mutation/useAchievementMutations';

// Activity hooks
export * from './query/useActivityQueries';
export * from './mutation/useActivityMutations';

// User hooks
export * from './query/useUserQueries';
export * from './mutation/useUserMutations';

// Activity Log hooks
export * from './query/useActivityLogQueries';
export * from './mutation/useActivityLogMutations';

// Dictionary hooks
export * from './query/useDictionaryQueries';

// Reading Session hooks
export * from './query/useReadingSessionQueries';
export * from './mutation/useReadingSessionMutations';

// Reading Material hooks
export * from './query/useReadingMaterialQueries';
export * from './mutation/useReadingMaterialMutations';

// Genre hooks
export * from './query/useGenreQueries';
export * from './mutation/useGenreMutations';

// Export utilities
export * from './api/apiUtils';