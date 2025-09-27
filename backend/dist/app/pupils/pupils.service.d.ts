import { UpdatePupilProfileDto } from './dto/update-pupil-profile.dto';
import { Kysely } from 'kysely';
import { DB } from '@/database/db';
import { Pupil, PupilLeaderboard } from '@/database/schemas';
export declare class PupilsService {
    private readonly db;
    constructor(db: Kysely<DB>);
    getPupilProfile(userId: string): Promise<Pupil>;
    updatePupilProfile(userId: string, updatePupilProfileDto: UpdatePupilProfileDto): Promise<Pupil>;
    getPupilByUsername(username: string): Promise<{
        message: string;
        data: {
            user: {
                id: string;
                first_name: string;
                last_name: string;
                avatar: string;
                username: string;
            };
            pupil: {
                id: string;
                age: number;
                grade_level: number;
                level: number;
            };
        };
    }>;
    getGlobalPupilLeaderboard(): Promise<PupilLeaderboard[]>;
    getPupilLeaderBoardByPupilId(pupilId: string): Promise<PupilLeaderboard[]>;
}
