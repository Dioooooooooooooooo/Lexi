import { MinigamesService } from './minigames.service';
import { CreateChoicesGame, CreateSentenceRearrangementGame, CreateWordsFromLettersGame } from './dto/create-minigame.dto';
import { Minigame, MinigameLog } from '@/database/schemas';
import { CreateMinigameLogDto } from './dto/create-minigame-log.dto';
import { SuccessResponseDto } from '@/common/dto';
import { CompleteReadingSessionDto } from './dto/complete-reading-session.dto';
import { UpdateMinigameLogDto } from './dto/update-minigame-log.dto';
import { UserResponseDto } from '../auth/dto/auth.dto';
export declare class MinigamesController {
    private readonly minigamesService;
    constructor(minigamesService: MinigamesService);
    createWFLMinigame(request: CreateWordsFromLettersGame): Promise<SuccessResponseDto<Minigame>>;
    createChoicesMinigame(request: CreateChoicesGame): Promise<SuccessResponseDto<Minigame>>;
    createSRMinigame(request: CreateSentenceRearrangementGame): Promise<SuccessResponseDto<Minigame>>;
    findMinigamesByMaterialID(readingMaterialID: string): Promise<SuccessResponseDto<Minigame[]>>;
    findMinigamelogsByReadingSessionID(readingSessionId: string): Promise<SuccessResponseDto<MinigameLog[]>>;
    createSentenceRearrangementLog(minigameLogDto: CreateMinigameLogDto): Promise<SuccessResponseDto<MinigameLog>>;
    updateSentenceRearrangementLog(minigameLogDto: UpdateMinigameLogDto): Promise<SuccessResponseDto<MinigameLog>>;
    createChoicesLog(minigameLogDto: CreateMinigameLogDto): Promise<SuccessResponseDto<MinigameLog>>;
    updateChoicesLog(minigameLogDto: UpdateMinigameLogDto): Promise<SuccessResponseDto<MinigameLog>>;
    createWordsFromLettersLog(minigameLogDto: CreateMinigameLogDto): Promise<SuccessResponseDto<MinigameLog>>;
    updateWordsFromLettersLog(minigameLogDto: UpdateMinigameLogDto): Promise<SuccessResponseDto<MinigameLog>>;
    findMinigamesBySessionID(readingSessionID: string): Promise<SuccessResponseDto<Minigame[]>>;
    findRandomMinigamesBySessionID(readingSessionID: string): Promise<SuccessResponseDto<Minigame[]>>;
    findWordsFromLettersMinigame(readingMaterialID: string): Promise<SuccessResponseDto<Minigame>>;
    getMinigamesCompletion(readingSessionID: string, req: {
        user: UserResponseDto;
    }): Promise<SuccessResponseDto<CompleteReadingSessionDto>>;
}
