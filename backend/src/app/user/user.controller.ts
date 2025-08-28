import {
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  Request,
  Query,
  BadRequestException,
  Param,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth } from "@nestjs/swagger";
import { SuccessResponseDto } from "@/common/dto";
import { LoginStreak, Session } from "@/database/schemas";
import { UserResponseDto } from "../auth/dto/auth.dto";
import { RolesGuard } from "../auth/role-guard";
import { Roles } from "@/decorators/roles.decorator";

@UseGuards(AuthGuard("jwt"), RolesGuard)
@ApiBearerAuth("JWT-auth")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(["Pupil"])
  @Put("me/streak")
  async updateLoginStreak(
    @Request() req: { user: UserResponseDto },
  ): Promise<SuccessResponseDto<LoginStreak>> {
    const loginStreak = await this.userService.updateLoginStreak(req.user.id);
    return { message: "Login streak updated successfully", data: loginStreak };
  }

  @Roles(["Pupil"])
  @Get("me/streak")
  async getLoginStreak(
    @Request() req: { user: UserResponseDto },
  ): Promise<SuccessResponseDto<LoginStreak>> {
    const loginStreak = await this.userService.getLoginStreak(req.user.id);
    return { message: "Login streak fetched successfully", data: loginStreak };
  }

  @Post("me/sessions")
  async createSession(
    @Request() req: { user: UserResponseDto },
  ): Promise<SuccessResponseDto<Session>> {
    const session = await this.userService.createSession(req.user.id);
    return { message: "Session created successfully", data: session };
  }

  @Put("me/sessions/:sessionId")
  async endSession(
    @Request() req: { user: UserResponseDto },
    @Param("sessionId") sessionId: string,
  ): Promise<SuccessResponseDto<Session>> {
    const session = await this.userService.endSession(req.user.id, sessionId);
    return { message: "Session ended successfully", data: session };
  }

  @Get("me/sessions")
  async getTotalSessions(
    @Request() req: { user: UserResponseDto },
  ): Promise<SuccessResponseDto<{ number }>> {
    const session = await this.userService.getTotalSessions(req.user.id);
    return { message: "Total sessions fetched successfully", data: session };
  }

  @Get("search")
  async searchUsers(
    @Query("query") query: string,
    @Query("role") role: string,
  ): Promise<SuccessResponseDto<UserResponseDto[]>> {
    if (!query || query.trim() === "") {
      throw new BadRequestException("Search query cannot be empty.");
    }

    if (!role || role.trim() === "") {
      throw new BadRequestException("Role cannot be empty.");
    }

    const users = await this.userService.searchUsersByRole(query, role);

    if (!users || users.length === 0) {
      return { message: "No users found.", data: [] };
    }

    return { message: "Users fetched successfully.", data: users };
  }
}
