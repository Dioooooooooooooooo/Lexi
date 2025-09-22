import { Achievement } from './Achievement';
import { Minigame } from './Minigame';
import { ReadingMaterial } from './ReadingMaterial';

export interface ReadingSession {
  id: string;
  pupil_id: string;
  reading_material_id: string;
  completion_percentage: number;
  started_at: string;
  completed_at: string;
  minigames: Minigame[];
}

export interface CompletedReadingSession {
  achievements: Achievement[];
  recommendations: ReadingMaterial[];
  level: number;
}
