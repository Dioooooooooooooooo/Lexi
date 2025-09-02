import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SuccessResponseDto } from '../../common/dto';
import type { Achievement, PupilAchievement } from '../../database/schemas';
import { Roles } from '../../decorators/roles.decorator';
import { UserResponseDto } from '../auth/dto/auth.dto';
import { RolesGuard } from '../auth/role-guard';
import { PupilsService } from '../pupils/pupils.service';
import { AchievementsService } from './achievements.service';

@Controller('achievements')
@ApiTags('Achievements')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth('JWT-auth')
export class AchievementsController {
  constructor(
    private readonly achievementsService: AchievementsService,
    private readonly pupilsService: PupilsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get pupil achievements',
  })
  @Roles(['Pupil'])
  async getPupilAchievements(
    @Request() req: { user: UserResponseDto },
  ): Promise<SuccessResponseDto<Achievement[]>> {
    // Only pupils have achievements
    if (req.user.role !== 'Pupil') {
      return { message: 'User achievements successfully fetched', data: [] };
    }

    const pupil = await this.pupilsService.getPupilProfile(req.user.id);
    const data = await this.achievementsService.getUserAchievements(pupil.id);
    return { message: 'Successfully fetched pupil achievement', data };
  }

  @Post('pupil/:pupilId/achievement/:achievementName')
  @ApiOperation({
    summary: 'Add pupil achievement',
  })
  @Roles(['Teacher'])
  async addPupilAchievement(
    @Param('pupilId') pupilId: string,
    @Param('achievementName') achievementName: string,
  ): Promise<SuccessResponseDto<PupilAchievement>> {
    const data = await this.achievementsService.awardAchievementByName(
      pupilId,
      achievementName,
    );
    return { message: 'Successfully added pupil achievement.', data };
  }

  @Get('pupils/:pupilId')
  @ApiOperation({
    summary: 'Get achievements for specific pupil (admin/testing)',
  })
  @Roles(['Teacher', 'Pupil'])
  async getPupilAchievementsById(
    @Param('pupilId') pupilId: string,
  ): Promise<SuccessResponseDto<Achievement[]>> {
    const data = await this.achievementsService.getUserAchievements(pupilId);
    return { message: 'Successfully fetched pupil achievements', data };
  }

  @Delete('pupils/:pupilId/achievements/:achievementId')
  @ApiOperation({
    summary: 'Remove specific achievement from specific pupil',
  })
  @Roles(['Teacher'])
  async removePupilAchievement(
    @Param('pupilId') pupilId: string,
    @Param('achievementId') achievementId: string,
  ): Promise<SuccessResponseDto<PupilAchievement>> {
    const data = await this.achievementsService.removePupilAchievement(
      pupilId,
      achievementId,
    );
    return { message: 'Achievement removed from pupil successfully', data };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete achievement by id (safety measure)',
  })
  @Roles(['Teacher', 'Pupil'])
  async remove(
    @Param('id') id: string,
  ): Promise<SuccessResponseDto<Achievement>> {
    const data = await this.achievementsService.remove(id);
    return { message: 'Achievement successfully deleted', data };
  }
}
