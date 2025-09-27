import { PupilsService } from "./pupils.service";
import { UpdatePupilProfileDto } from "./dto/update-pupil-profile.dto";
import { UserResponseDto } from "../auth/dto/auth.dto";
import { SuccessResponseDto } from "@/common/dto";
import { Pupil, PupilLeaderboard } from "@/database/schemas";
export declare class PupilsController {
    private readonly pupilsService;
    constructor(pupilsService: PupilsService);
    getPupilProfile(req: {
        user: UserResponseDto;
    }): Promise<SuccessResponseDto<Pupil>>;
    updatePupilProfile(req: {
        user: UserResponseDto;
    }, updatePupilDto: UpdatePupilProfileDto): Promise<SuccessResponseDto<Pupil>>;
    getPupilByUsername(username: string): Promise<SuccessResponseDto<Record<string, any>>>;
    getGlobalPupilLeaderboard(): Promise<SuccessResponseDto<PupilLeaderboard[]>>;
    getPupilLeaderBoardByPupilId(pupilId: string): Promise<SuccessResponseDto<PupilLeaderboard[]>>;
}
