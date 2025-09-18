import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateActivityDTO } from './dto/create-activity.dto';
import { SuccessResponseDto } from '@/common/dto';
import { Activity } from '@/database/schemas';
import { ActivityService } from './activity.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/role-guard';
import { Roles } from '@/decorators/roles.decorator';
import { classroom } from 'googleapis/build/src/apis/classroom';
import { UpdateActivityDTO } from './dto/update-activity.dto';

@ApiTags('Activities')
@Controller('classrooms/:classroomId/activity')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth('JWT-auth')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Activity',
  })
  @Roles(['Teacher'])
  @ApiResponse({
    status: 201,
    description: 'Activity created successfully',
    type: SuccessResponseDto,
  })
  @ApiParam({ name: 'classroomId', required: true, type: String })
  async create(
    @Param('classroomId') classroomId: string,
    @Body() createActivityDTO: CreateActivityDTO,
  ): Promise<SuccessResponseDto<Activity>> {
    const data = await this.activityService.create(
      createActivityDTO,
      classroomId,
    );

    return { message: 'Activity created', data };
  }

  @Get(':activityId')
  @ApiOperation({ summary: 'Get Activity by id' })
  @ApiResponse({
    status: 200,
    description: 'Activity fetched successfully',
    type: SuccessResponseDto,
  })
  async findOne(
    @Param('classroomId') classroomId: string,
    @Param('activityId') activityId: string,
  ): Promise<SuccessResponseDto<Activity>> {
    const data = await this.activityService.findOne(activityId);

    return { message: 'Activity successfully fetched', data };
  }

  @Get()
  @ApiOperation({ summary: 'Get all Activities by Classroom' })
  @ApiResponse({
    status: 200,
    description: 'Activities of classroom fetched successfully',
    type: SuccessResponseDto,
  })
  async findAllByClassroomId(
    @Param('classroomId') classroomId: string,
  ): Promise<SuccessResponseDto<Activity[]>> {
    const data = await this.activityService.findAllByClassroomId(classroomId);
    return { message: 'Activies of classroom successfull fetched', data };
  }

  @Patch(':activityId')
  @ApiOperation({ summary: 'Update Activity' })
  @Roles(['Teacher'])
  @ApiResponse({
    status: 200,
    description: 'Activity updated successfully',
    type: SuccessResponseDto,
  })
  async update(
    @Param('classroomId') classroomId: string,
    @Param('activityId') activityId: string,
    @Body() updateActivityDTO: UpdateActivityDTO,
  ): Promise<SuccessResponseDto<Activity>> {
    const data = await this.activityService.update(
      activityId,
      updateActivityDTO,
    );

    return { message: 'Activity successfully updated', data };
  }

  @Delete(':activityId')
  @ApiOperation({ summary: 'Delete Activity' })
  @Roles(['Teacher'])
  @ApiResponse({
    status: 200,
    description: 'Activity deleted successfully',
    type: SuccessResponseDto,
  })
  async remove(
    @Param('classroomId') classroomId: string,
    @Param('activityId') activityId: string,
  ): Promise<SuccessResponseDto<Activity>> {
    const data = await this.activityService.remove(activityId);

    return { message: 'Activity successfully deleted', data };
  }
}
