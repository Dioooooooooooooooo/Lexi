import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '@/decorators/roles.decorator';
import { RolesGuard } from '../auth/role-guard';
import { SuccessResponseDto } from '@/common/dto';

@ApiTags('ActivityLogs')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth('JWT-auth')
@Roles(['Teacher'])
@Controller('classroom/activity-logs/:activityId')
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Post()
  @ApiOperation({ summary: 'Create Activity Log' })
  @ApiResponse({
    status: 201,
    description: 'Activity Log created successfully',
    type: SuccessResponseDto,
  })
  async create(
    @Param('activityId') activityId: string,
    @Body() createActivityLogDto: CreateActivityLogDto,
  ) {
    const data = await this.activityLogsService.create(
      createActivityLogDto,
      activityId,
    );

    return { message: 'Added Reading Material Log successfully', data };
  }

  // all stats from students from this activity
  @Get()
  @ApiOperation({ summary: "Get an Activity's Activity Logs" })
  @ApiResponse({
    status: 200,
    description: 'Activity logs for activity fetched successfully',
    type: SuccessResponseDto,
  })
  async findOne(@Param('activityId') activityId: string) {
    const data = await this.activityLogsService.findOne(activityId);

    return {
      message: 'Activity logs for activity fetched successfully',
      data,
    };
  }

  @Get('classroom/:classroomId/activity-logs')
  @ApiOperation({ summary: "Get all Classroom Acitivies' Activity Log" })
  @ApiResponse({
    status: 200,
    description: 'Activity logs for classroom fetched successfully',
    type: SuccessResponseDto,
  })
  async findAll(
    @Param('activityId') activityId: string,
    @Param('classroomId') classroomId: string,
  ) {
    const data = await this.activityLogsService.findAll(classroomId);

    return {
      message: 'Activity logs for classroom fetched successfully',
      data,
    };
  }

  // @Patch(":id")
  // update(
  //   @Param("id") id: string,
  //   @Body() updateActivityLogDto: UpdateActivityLogDto,
  // ) {
  //   return this.activityLogsService.update(+id, updateActivityLogDto);
  // }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.activityLogsService.remove(+id);
  // }
}
