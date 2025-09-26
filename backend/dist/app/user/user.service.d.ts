import { DB } from '@/database/db';
import { LoginStreak, Session } from '@/database/schemas';
import { Kysely } from 'kysely';
import { UserResponseDto } from '../auth/dto/auth.dto';
import { PupilsService } from '../pupils/pupils.service';
import { AchievementsService } from '../achievements/achievements.service';
export declare class UserService {
    private readonly db;
    private readonly pupilService;
    private readonly achievementService;
    constructor(db: Kysely<DB>, pupilService: PupilsService, achievementService: AchievementsService);
    updateLoginStreak(user_id: string): Promise<LoginStreak | null>;
    getLoginStreak(user_id: string): Promise<LoginStreak>;
    searchUsersByRole(query: string, role: string): Promise<UserResponseDto[]>;
    getUsersByRole(role: string): Promise<UserResponseDto[]>;
    createSession(user_id: string): Promise<Session>;
    endSession(id: string, sessionId: string): Promise<Session>;
    getTotalSessions(user_id: string): Promise<{
        number: any;
    }>;
}
