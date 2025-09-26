import { Kysely } from 'kysely';
import { Minigame, MinigameLog, MinigameType, ReadingSession } from '../../database/schemas/public.schema';
import { CreateMinigameLogDto } from './dto/create-minigame-log.dto';
import { DB } from '../../database/db.d';
import { CompleteReadingSessionDto } from './dto/complete-reading-session.dto';
import { AchievementsService } from '../achievements/achievements.service';
import { ReadingMaterialsService } from '../reading-materials/reading-materials.service';
import { CreateMinigameDto } from './dto/create-minigame.dto';
import { UpdateMinigameLogDto } from './dto/update-minigame-log.dto';
export declare class MinigamesService {
    private readonly db;
    private readonly achievementService;
    private readonly readingMaterialService;
    constructor(db: Kysely<DB>, achievementService: AchievementsService, readingMaterialService: ReadingMaterialsService);
    getAssignedMinigamesBySessionID(readingSessionId: string): Promise<Minigame[]>;
    createMinigame(minigameType: MinigameType, request: CreateMinigameDto): Promise<Minigame>;
    getMaxScore(minigameType: MinigameType, request: CreateMinigameDto): number;
    createMinigamesCompletion(readingSessionID: string, userId: string): Promise<CompleteReadingSessionDto>;
    getRandomMinigamesBySessionID(readingSessionID: string): Promise<Minigame[]>;
    getRandomMinigamesByMaterialID(readingMaterialID: string): Promise<Minigame[]>;
    createMinigameLogs(minigames: Minigame[], readingSession: ReadingSession): Promise<any[]>;
    pickMinigamesNoConsecutiveSameType(allMinigames: Minigame[]): Minigame[];
    getWordsFromLettersMinigame(readingMaterialID: string): Promise<Minigame>;
    createMinigameLog(minigameType: MinigameType, minigameLogDto: CreateMinigameLogDto): Promise<MinigameLog>;
    updateMinigameLog(minigameType: MinigameType, minigameLogDto: UpdateMinigameLogDto): Promise<MinigameLog>;
    getLogsByReadingSessionID(readingSessionID: string): Promise<MinigameLog[]>;
}
