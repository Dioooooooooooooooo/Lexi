import { PupilAchievement, ReadingMaterial } from '@/database/schemas';
export declare class CompleteReadingSessionDto {
    achievements?: PupilAchievement[];
    recommendations?: ReadingMaterial[];
    level: number;
}
