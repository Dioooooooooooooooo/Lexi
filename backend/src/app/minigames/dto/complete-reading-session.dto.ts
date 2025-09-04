import { Achievement, PupilAchievement, ReadingMaterial } from '@/database/schemas';

export class CompleteReadingSessionDto {
  achievements?: PupilAchievement[];
  recommendations?: ReadingMaterial[];
  level: number;
}
