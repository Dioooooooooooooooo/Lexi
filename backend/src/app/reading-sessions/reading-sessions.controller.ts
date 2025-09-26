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
import { ReadingSessionsService } from './reading-sessions.service';
import { CreateReadingSessionDto } from './dto/create-reading-session.dto';
import { UpdateReadingSessionDto } from './dto/update-reading-session.dto';
import { RolesGuard } from '../auth/role-guard';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from '@/decorators/roles.decorator';
import { SuccessResponseDto } from '@/common/dto';

@Controller('reading-sessions')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth('JWT-auth')
export class ReadingSessionsController {
  constructor(
    private readonly readingSessionsService: ReadingSessionsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a reading session',
  })
  @ApiResponse({
    status: 201,
    description: 'Reading session created successfully',
    type: SuccessResponseDto,
  })
  async create(@Body() createReadingSessionDto: CreateReadingSessionDto) {
    const newSession = await this.readingSessionsService.create(
      createReadingSessionDto,
    );

    return {
      message: 'Reading session created successfully',
      data: newSession,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all reading sessions',
  })
  @ApiResponse({
    status: 200,
    description: 'Reading sessions fetched successfully',
    type: SuccessResponseDto,
  })
  async findAll() {
    const readingSessions = await this.readingSessionsService.findAll();

    return {
      message: 'Reading sessions fetched successfully',
      data: readingSessions,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a reading session by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Reading session fetched successfully',
    type: SuccessResponseDto,
  })
  async findOne(@Param('id') id: string) {
    const readingSession = await this.readingSessionsService.findOne(id);

    return {
      message: 'Reading session fetched successfully',
      data: readingSession,
    };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a reading session by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Reading session updated successfully',
    type: SuccessResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateReadingSessionDto: UpdateReadingSessionDto,
  ) {
    const updatedReadingSession = await this.readingSessionsService.update(
      id,
      updateReadingSessionDto,
    );

    return {
      message: 'Reading session updated successfully',
      data: updatedReadingSession,
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a reading session by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Reading session deleted successfully',
    type: SuccessResponseDto,
  })
  async remove(@Param('id') id: string) {
    const deletedReadingSession = await this.readingSessionsService.remove(id);

    return {
      message: 'Reading session updated successfully',
      data: deletedReadingSession,
    };
  }
}
