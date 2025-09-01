import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CreateActivityDTO } from "./dto/create-activity.dto";
import { SuccessResponseDto } from "@/common/dto";
import { Activity } from "@/database/schemas";
import { ActivityService } from "./activity.service";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../auth/role-guard";
import { Roles } from "@/decorators/roles.decorator";
import { classroom } from "googleapis/build/src/apis/classroom";
import { UpdateActivityDTO } from "./dto/update-activity.dto";

@ApiTags("Activities")
@Controller("classrooms/:classroomId/activity")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@ApiBearerAuth("JWT-auth")
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  @ApiOperation({
    summary: "Create Activity",
  })
  @Roles(["Teacher"])
  async create(
    @Param("classroomId") classroomId: string,
    @Body() createActivityDTO: CreateActivityDTO,
  ): Promise<SuccessResponseDto<Activity>> {
    const data = await this.activityService.create(
      createActivityDTO,
      classroomId,
    );

    return { message: "Activity created", data };
  }

  @Get(":activityId")
  @ApiOperation({ summary: "Get Activity by id" })
  async findOne(
    @Param("activityId") activityId: string,
  ): Promise<SuccessResponseDto<Activity>> {
    const data = await this.activityService.findOne(activityId);

    return { message: "Activity successfully fetched", data };
  }

  @Get()
  @ApiOperation({ summary: "Get all Activities by Classroom" })
  async findAllByClassroomId(
    @Param("classroomId") classroomId: string,
  ): Promise<SuccessResponseDto<Activity[]>> {
    const data = await this.activityService.findAllByClassroomId(classroomId);

    return { message: "Activies of classroom successfull fetched", data };
  }

  @Patch(":activityId")
  @ApiOperation({ summary: "Update Activity" })
  async update(
    @Param("activityId") activityId: string,
    @Body() updateActivityDTO: UpdateActivityDTO,
  ): Promise<SuccessResponseDto<Activity>> {
    const data = await this.activityService.update(
      activityId,
      updateActivityDTO,
    );

    return { message: "Activity successfully updated", data };
  }

  @Delete(":activityId")
  @ApiOperation({ summary: "Delete Activity" })
  async remove(
    @Param("activityId") activityId: string,
  ): Promise<SuccessResponseDto<Activity>> {
    const data = await this.activityService.remove(activityId);

    return { message: "Activity successfully deleted", data };
  }
}
