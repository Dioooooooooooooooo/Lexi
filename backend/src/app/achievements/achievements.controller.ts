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
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SuccessResponseDto } from '../../common/dto';
import { RolesGuard } from '../auth/role-guard';
import { Roles } from '../../decorators/roles.decorator';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import type { Achievement } from '../../database/schemas';

@Controller('achievements')
@ApiTags('Achievements')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth('JWT-auth')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create an achievement',
  })
  @Roles(['Teacher', 'Admin'])
  async create(
    @Body() createAchievementDto: CreateAchievementDto,
  ): Promise<SuccessResponseDto<Achievement>> {
    const data = await this.achievementsService.create(createAchievementDto);

    return { message: 'Achievement created successfully', data };
  }

  @Get()
  @ApiOperation({
    summary: 'Find all achievements',
  })
  @Roles(['Teacher', 'Student', 'Admin'])
  async findAll(): Promise<SuccessResponseDto<Achievement[]>> {
    const data = await this.achievementsService.findAll();
    return { message: 'Achievements successfully fetched', data };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find achievement by id',
  })
  @Roles(['Teacher', 'Student', 'Admin'])
  async findOne(
    @Param('id') id: string,
  ): Promise<SuccessResponseDto<Achievement>> {
    const data = await this.achievementsService.findOne(id);
    return { message: 'Achievement successfully fetched', data };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update achievement by id',
  })
  @Roles(['Teacher', 'Admin'])
  async update(
    @Param('id') id: string,
    @Body() updateAchievementDto: UpdateAchievementDto,
  ): Promise<SuccessResponseDto<Achievement>> {
    const data = await this.achievementsService.update(
      id,
      updateAchievementDto,
    );
    return { message: 'Achievement successfully updated', data };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete achievement by id',
  })
  @Roles(['Admin'])
  async remove(
    @Param('id') id: string,
  ): Promise<SuccessResponseDto<Achievement>> {
    const data = await this.achievementsService.remove(id);
    return { message: 'Achievement successfully deleted', data };
  }
}
