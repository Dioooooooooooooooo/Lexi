import { Achievement, ReadingMaterial } from '@/database/schemas';

export class CompleteReadingSessionDto {
  achievements?: Achievement[];
  recommendations?: ReadingMaterial[];
  level: number;
}
