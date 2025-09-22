export interface Achievement {
  id: string;
  name: string;
  description: string;
  badge: string;
  created_at: string;
}

export interface PupilAchievement {
  id: string;
  pupil_id: string;
  achievement_id: string;
  created_at: string;
}
