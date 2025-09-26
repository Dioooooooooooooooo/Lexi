import { Kysely } from 'kysely';
import { DB } from '../../database/db';
import type { Achievement, PupilAchievement } from '../../database/schemas';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
export declare class AchievementsService {
    private readonly db;
    constructor(db: Kysely<DB>);
    create(createAchievementDto: CreateAchievementDto): Promise<Achievement>;
    findAll(): Promise<Achievement[]>;
    findOne(id: string): Promise<Achievement>;
    update(id: string, updateAchievementDto: UpdateAchievementDto): Promise<Achievement>;
    remove(id: string): Promise<Achievement>;
    getUserAchievements(pupilId: string): Promise<Achievement[]>;
    awardAchievementToUser(pupilId: string, achievementId: string): Promise<PupilAchievement>;
    awardAchievementByName(pupilId: string, achievementName: string): Promise<PupilAchievement>;
    hasAchievement(pupilId: string, achievementName: string): Promise<PupilAchievement | null>;
    addLoginAchievement(pupilId: string): Promise<PupilAchievement[]>;
    addBooksReadAchievement(pupilId: string): Promise<PupilAchievement[]>;
    removePupilAchievement(pupilId: string, achievementId: string): Promise<PupilAchievement>;
}
