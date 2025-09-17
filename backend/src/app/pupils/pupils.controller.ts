import {
  Controller,
  Get,
  Body,
  Patch,
  UseGuards,
  Request,
  HttpStatus,
  Param,
} from "@nestjs/common";
import { PupilsService } from "./pupils.service";
import { UpdatePupilProfileDto } from "./dto/update-pupil-profile.dto";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { UserResponseDto } from "../auth/dto/auth.dto";
import { ErrorResponseDto, SuccessResponseDto } from "@/common/dto";
import { Roles } from "@/decorators/roles.decorator";
import { RolesGuard } from "../auth/role-guard";
import { Pupil, PupilLeaderboard } from "@/database/schemas";

@Controller("pupils")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@ApiBearerAuth("JWT-auth")
@Roles(["Pupil"])
export class PupilsController {
  constructor(private readonly pupilsService: PupilsService) {}

  @Get("me")
  @ApiOperation({
    summary: "Get user pupil profile",
  })
  @ApiResponse({
    status: 201,
    description: "Pupil profile successfully fetched",
    type: SuccessResponseDto,
    example: {
      message: "Pupil profile successfully fetched",
      data: {
        age: 10,
        grade_level: 6,
        level: 20,
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "Invalid credentials",
    type: ErrorResponseDto,
    example: {
      message: "Invalid credentials",
      error: "Unauthorized",
    },
  })
  async getPupilProfile(
    @Request() req: { user: UserResponseDto },
  ): Promise<SuccessResponseDto<Pupil>> {
    const data = await this.pupilsService.getPupilProfile(req.user.id);
    return { message: "Pupil profile successfully fetched", data };
  }

  @Patch("me")
  @ApiOperation({
    summary: "Update user pupil profile",
  })
  @ApiBody({
    type: UpdatePupilProfileDto,
    description: "Pupil profile update data",
    examples: {
      example1: {
        summary: "Example update",
        description: "A sample pupil profile update",
        value: {
          age: 12,
          grade_level: 7,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Pupil profile successfully updated",
    type: SuccessResponseDto,
    example: {
      message: "Pupil profile successfully updated",
      data: {
        age: 10,
        grade_level: 6,
        level: 20,
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "Invalid credentials",
    type: ErrorResponseDto,
    example: {
      message: "Invalid credentials",
      error: "Unauthorized",
    },
  })
  async updatePupilProfile(
    @Request() req: { user: UserResponseDto },
    @Body() updatePupilDto: UpdatePupilProfileDto,
  ): Promise<SuccessResponseDto<Pupil>> {
    const data = await this.pupilsService.updatePupilProfile(
      req.user.id,
      updatePupilDto,
    );
    return { message: "Pupil profile successfully updated", data };
  }

  @Get(":username")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Get public pupil profile",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Pupil profile successfully fetched",
    type: SuccessResponseDto,
    example: {
      message: "Profile successfully fetched",
      data: {
        user: {
          id: "420eafa8-5fb9-430d-bdd5-04806c52973c",
          first_name: "John",
          last_name: "Doe",
          avatar: "https://example.com",
          username: "johndoes",
        },
        pupil: {
          id: "dfc1c188-409c-4eeb-995f-2836e84f2132",
          age: 12,
          grade_level: 6,
          level: 30,
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "Invalid credentials",
    type: ErrorResponseDto,
    example: {
      message: "Invalid credentials",
      error: "Unauthorized",
    },
  })
  async getPupilByUsername(
    @Param("username") username: string,
  ): Promise<SuccessResponseDto<Record<string, any>>> {
    const data = await this.pupilsService.getPupilByUsername(username);
    return {
      message: "successfully fetched pupil leaderboard",
      data,
    };
  }

  @Get("leaderboard")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Get global pupil leaderboard",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Global pupil leaderboard successfully fetched",
    type: SuccessResponseDto,
    example: {
      message: "Global pupil leaderboard successfully fetched",
      data: {},
    },
  })
  @ApiUnauthorizedResponse({
    description: "Invalid credentials",
    type: ErrorResponseDto,
    example: {
      message: "Invalid credentials",
      error: "Unauthorized",
    },
  })
  async getGlobalPupilLeaderboard(): Promise<
    SuccessResponseDto<PupilLeaderboard[]>
  > {
    const data = await this.pupilsService.getGlobalPupilLeaderboard();

    return {
      message: "Global pupil leaderboard successfully fetched",
      data,
    };
  }

  @Get("leaderboard/:pupilId")
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Pupil leaderboard successfully fetched",
    type: SuccessResponseDto,
    example: {
      message: "Global pupil leaderboard successfully fetched",
      data: {},
    },
  })
  @ApiUnauthorizedResponse({
    description: "Invalid credentials",
    type: ErrorResponseDto,
    example: {
      message: "Invalid credentials",
      error: "Unauthorized",
    },
  })
  async getPupilLeaderBoardByPupilId(
    @Param('pupilId') pupilId: string,
  ): Promise<SuccessResponseDto<PupilLeaderboard[]>> {
    const data = await this.pupilsService.getPupilLeaderBoardByPupilId(pupilId);
    return {
      message: "Pupil successfully fetched",
      data,
    };
  }
}
