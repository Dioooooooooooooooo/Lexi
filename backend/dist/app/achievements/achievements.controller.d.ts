import { SuccessResponseDto } from '../../common/dto';
import type { Achievement, PupilAchievement } from '../../database/schemas';
import { UserResponseDto } from '../auth/dto/auth.dto';
import { PupilsService } from '../pupils/pupils.service';
import { AchievementsService } from './achievements.service';
export declare class AchievementsController {
    private readonly achievementsService;
    private readonly pupilsService;
    constructor(achievementsService: AchievementsService, pupilsService: PupilsService);
    getPupilAchievements(req: {
        user: UserResponseDto;
    }): Promise<SuccessResponseDto<Achievement[]>>;
    addPupilAchievement(pupilId: string, achievementName: string): Promise<SuccessResponseDto<PupilAchievement>>;
    getPupilAchievementsById(pupilId: string): Promise<SuccessResponseDto<Achievement[]>>;
    removePupilAchievement(pupilId: string, achievementId: string): Promise<SuccessResponseDto<PupilAchievement>>;
    remove(id: string): Promise<SuccessResponseDto<Achievement>>;
}
