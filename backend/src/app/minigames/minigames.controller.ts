import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { MinigamesService } from './minigames.service';
import {
  CreateChoicesGame,
  CreateMinigameDto,
  CreateSentenceRearrangementGame,
  CreateWordsFromLettersGame,
} from './dto/create-minigame.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Minigame, MinigameLog, MinigameType } from '@/database/schemas';
import { CreateMinigameLogDto } from './dto/create-minigame-log.dto';
import { SuccessResponseDto } from '@/common/dto';
import { CompleteReadingSessionDto } from './dto/complete-reading-session.dto';
import { RolesGuard } from '../auth/role-guard';
import { Roles } from '@/decorators/roles.decorator';
import { UpdateMinigameLogDto } from './dto/update-minigame-log.dto';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth('JWT-auth')
@Controller('minigames')
export class MinigamesController {
  constructor(private readonly minigamesService: MinigamesService) {}
  /*
        GET /minigames/readingmaterials/:readingMaterialID/random
        GET /minigames/:readingSessionID/complete
        GET /minigames/:readingSessionID/random
    */

  @Roles(['Teacher'])
  @Post('wordsFromLetters')
  @ApiOperation({ summary: 'Create WFL minigame' })
  @ApiResponse({
    status: 201,
    description: 'Words From Letters minigame created successfully',
    type: SuccessResponseDto<Minigame>,
  })
  async createWFLMinigame(
    @Body() request: CreateWordsFromLettersGame,
  ): Promise<SuccessResponseDto<Minigame>> {
    const minigame = await this.minigamesService.createMinigame(
      MinigameType.WordsFromLetters,
      request,
    );
    return {
      message: 'Words from letters successfully created.',
      data: minigame,
    };
  }

  @Roles(['Teacher'])
  @Post('choices')
  @ApiOperation({ summary: 'Create Choices minigame' })
  @ApiResponse({
    status: 201,
    description: 'Choices minigame created successfully',
    type: SuccessResponseDto<Minigame>,
  })
  async createChoicesMinigame(
    @Body() request: CreateChoicesGame,
  ): Promise<SuccessResponseDto<Minigame>> {
    const minigame = await this.minigamesService.createMinigame(
      MinigameType.Choices,
      request,
    );
    return {
      message: 'Choices successfully created.',
      data: minigame,
    };
  }

  @Roles(['Teacher'])
  @Post('sentenceRearrangement')
  @ApiOperation({ summary: 'Create SR minigame' })
  @ApiResponse({
    status: 201,
    description: 'Sentence Rearrangement minigame created successfully',
    type: SuccessResponseDto<Minigame>,
  })
  async createSRMinigame(
    @Body() request: CreateSentenceRearrangementGame,
  ): Promise<SuccessResponseDto<Minigame>> {
    const minigame = await this.minigamesService.createMinigame(
      MinigameType.SentenceRearrangement,
      request,
    );
    return {
      message: 'Sentence Rearrangement successfully created.',
      data: minigame,
    };
  }

  @Get('readingmaterials/:readingMaterialID/random')
  @ApiOperation({
    summary: 'Get 3 random minigames for a specific reading material',
  })
  @ApiResponse({
    status: 200,
    description: 'Random minigames fetched successfully',
    type: SuccessResponseDto<Minigame[]>,
  })
  async findMinigamesByMaterialID(
    @Param('readingMaterialID') readingMaterialID: string,
  ): Promise<SuccessResponseDto<Minigame[]>> {
    // Logic to fetch random minigames for a specific reading material
    // return `Random minigames for reading material ID: ${readingMaterialID}`;
    const randomMinigames =
      await this.minigamesService.getRandomMinigamesByMaterialID(
        readingMaterialID,
      );

    return {
      message: 'Random minigames successfully fetched',
      data: randomMinigames,
    };
  }

  @Get('logs/:readingSessionID')
  @ApiOperation({ summary: 'Get minigame logs for session id' })
  @ApiResponse({
    status: 200,
    description: 'Minigame logs successfully fetched.',
    type: SuccessResponseDto<MinigameLog[]>,
  })
  async findMinigamelogsByReadingSessionID(
    @Param('readingSessionID') readingSessionId: string,
  ): Promise<SuccessResponseDto<MinigameLog[]>> {
    const minigameLogs =
      await this.minigamesService.getLogsByReadingSessionID(readingSessionId);
    return {
      message: 'Minigame logs for reading session successfully fetched.',
      data: minigameLogs,
    };
  }

  @Post('logs/SentenceRearrangement')
  @ApiOperation({
    summary: 'Create a log for SentenceRearrangement minigame',
  })
  @ApiResponse({
    status: 201,
    description: 'Sentence Rearrangement Log created successfully',
    type: SuccessResponseDto<MinigameLog>,
  })
  async createSentenceRearrangementLog(
    @Body() minigameLogDto: CreateMinigameLogDto,
  ): Promise<SuccessResponseDto<MinigameLog>> {
    const minigamelog = await this.minigamesService.createMinigameLog(
      MinigameType.SentenceRearrangement,
      minigameLogDto,
    );

    return {
      message: 'Sentence Rearrangement Log successfully created.',
      data: minigamelog,
    };
  }

  @Patch('logs/SentenceRearrangement')
  @ApiOperation({ summary: 'Update log for SentenceRearrangement' })
  @ApiResponse({
    status: 200,
    description: 'Sentence Rearrangement Log updated successfully.',
    type: SuccessResponseDto<MinigameLog>,
  })
  async updateSentenceRearrangementLog(
    @Body() minigameLogDto: UpdateMinigameLogDto,
  ): Promise<SuccessResponseDto<MinigameLog>> {
    const minigamelog = await this.minigamesService.updateMinigameLog(
      MinigameType.SentenceRearrangement,
      minigameLogDto,
    );

    return {
      message: 'Sentence Rearrangement Log updated successfully.',
      data: minigamelog,
    };
  }

  @Post('logs/Choices')
  @ApiOperation({
    summary: 'Create a log for Choices minigame',
  })
  @ApiResponse({
    status: 201,
    description: 'Choices log created successfully',
    type: SuccessResponseDto<MinigameLog>,
  })
  async createChoicesLog(
    @Body() minigameLogDto: CreateMinigameLogDto,
  ): Promise<SuccessResponseDto<MinigameLog>> {
    const minigamelog = await this.minigamesService.createMinigameLog(
      MinigameType.Choices,
      minigameLogDto,
    );

    return {
      message: 'Choices log successfully created.',
      data: minigamelog,
    };
  }

  @Patch('logs/Choices')
  @ApiOperation({ summary: 'Update log for Choices' })
  @ApiResponse({
    status: 200,
    description: 'Choices Log updated successfully.',
    type: SuccessResponseDto<MinigameLog>,
  })
  async updateChoicesLog(
    @Body() minigameLogDto: UpdateMinigameLogDto,
  ): Promise<SuccessResponseDto<MinigameLog>> {
    const minigamelog = await this.minigamesService.updateMinigameLog(
      MinigameType.Choices,
      minigameLogDto,
    );

    return {
      message: 'Choices Log updated successfully.',
      data: minigamelog,
    };
  }

  @Post('logs/WordsFromLetters')
  @ApiOperation({
    summary: 'Create a log for WordsFromLetters minigame',
  })
  @ApiResponse({
    status: 201,
    description: 'Words From Letters log created successfully',
    type: SuccessResponseDto<MinigameLog>,
  })
  async createWordsFromLettersLog(
    @Body() minigameLogDto: CreateMinigameLogDto,
  ): Promise<SuccessResponseDto<MinigameLog>> {
    const minigamelog = await this.minigamesService.createMinigameLog(
      MinigameType.WordsFromLetters,
      minigameLogDto,
    );

    return {
      message: 'Words From Letters log successfully created.',
      data: minigamelog,
    };
  }

  @Patch('logs/WordsFromLetters')
  @ApiOperation({ summary: 'Update log for WordsFromLetters' })
  @ApiResponse({
    status: 200,
    description: 'WordsFromLetters Log updated successfully.',
    type: SuccessResponseDto<MinigameLog>,
  })
  async updateWordsFromLettersLog(
    @Body() minigameLogDto: UpdateMinigameLogDto,
  ): Promise<SuccessResponseDto<MinigameLog>> {
    const minigamelog = await this.minigamesService.updateMinigameLog(
      MinigameType.WordsFromLetters,
      minigameLogDto,
    );

    return {
      message: 'WordsFromLetters Log updated successfully.',
      data: minigamelog,
    };
  }

  @Get(':readingSessionID/random')
  @ApiOperation({
    summary: 'Get 3 random minigames for a specific reading session',
  })
  @ApiResponse({
    status: 200,
    description: 'Minigames fetched successfully',
    type: SuccessResponseDto<Minigame[]>,
  })
  async findMinigamesBySessionID(
    @Param('readingSessionID') readingSessionID: string,
  ): Promise<SuccessResponseDto<Minigame[]>> {
    // Logic to fetch random minigames for a specific reading session
    // return `Random minigames for reading session ID: ${readingSessionID}`;
    const minigames =
      await this.minigamesService.getRandomMinigamesBySessionID(
        readingSessionID,
      );

    return {
      message: 'Minigames successfully fetched',
      data: minigames,
    };
  }

  @Get(':readingMaterialID/wordsFromLetters')
  @ApiOperation({
    summary: 'Get WordsFromLetters minigame for a specific reading material',
  })
  @ApiResponse({
    status: 200,
    description: 'Words from Letters minigame fetched successfully',
    type: SuccessResponseDto<Minigame>,
  })
  async findWordsFromLettersMinigame(
    @Param('readingMaterialID') readingMaterialID: string,
  ): Promise<SuccessResponseDto<Minigame>> {
    // Logic to fetch WordsFromLetters minigame for a specific reading material
    // return `WordsFromLetters minigame for reading material ID: ${readingMaterialID}`;
    const minigame =
      await this.minigamesService.getWordsFromLettersMinigame(
        readingMaterialID,
      );
    return {
      message: 'Words from Letters successfully fetched',
      data: minigame,
    };
  }

  @Post(':readingSessionID/complete')
  @ApiOperation({
    summary:
      'Create a completion status of minigames for a specific reading session',
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: 201,
    description: 'Reading session completed successfully',
    type: SuccessResponseDto<CompleteReadingSessionDto>,
  })
  async getMinigamesCompletion(
    @Param('readingSessionID') readingSessionID: string,
  ): Promise<SuccessResponseDto<CompleteReadingSessionDto>> {
    // Logic to fetch completion status of minigames for a specific reading session
    // return `Minigames completion for reading session ID: ${readingSessionID}`;
    const sessionComplete =
      await this.minigamesService.createMinigamesCompletion(readingSessionID);
    return {
      message: 'Reading session successfully completed.',
      data: sessionComplete,
    };
  }
}
