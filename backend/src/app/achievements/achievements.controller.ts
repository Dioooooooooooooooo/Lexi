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
  @Roles(['Student'])
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

  @Post(':achievementName')
  @ApiOperation({
    summary: 'Add pupil achievement',
  })
  @Roles(['Student'])
  async addPupilAchievement(
    @Param('achievementName') achievementName: string,
    @Request() req: { user: UserResponseDto },
  ): Promise<SuccessResponseDto<PupilAchievement>> {
    const pupil = await this.pupilsService.getPupilProfile(req.user.id);
    const data = await this.achievementsService.awardAchievementByName(
      pupil.id,
      achievementName,
    );
    return { message: 'Successfully added pupil achievement.', data };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete achievement by id (safety measure)',
  })
  @Roles(['Teacher'])
  async remove(
    @Param('id') id: string,
  ): Promise<SuccessResponseDto<Achievement>> {
    const data = await this.achievementsService.remove(id);
    return { message: 'Achievement successfully deleted', data };
  }
}
