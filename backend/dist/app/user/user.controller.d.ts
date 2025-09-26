import { UserService } from './user.service';
import { SuccessResponseDto } from '@/common/dto';
import { LoginStreak, Session } from '@/database/schemas';
import { UserResponseDto } from '../auth/dto/auth.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    updateLoginStreak(req: {
        user: UserResponseDto;
    }): Promise<SuccessResponseDto<LoginStreak>>;
    getLoginStreak(req: {
        user: UserResponseDto;
    }): Promise<SuccessResponseDto<LoginStreak>>;
    createSession(req: {
        user: UserResponseDto;
    }): Promise<SuccessResponseDto<Session>>;
    endSession(req: {
        user: UserResponseDto;
    }, sessionId: string): Promise<SuccessResponseDto<Session>>;
    getTotalSessions(req: {
        user: UserResponseDto;
    }): Promise<SuccessResponseDto<{
        number: any;
    }>>;
    searchUsers(query: string, role: string): Promise<SuccessResponseDto<UserResponseDto[]>>;
}
