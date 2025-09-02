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
} from '@nestjs/common';
import { MinigamesService } from './minigames.service';
import { CreateMinigameDto } from './dto/create-minigame.dto';
import { UpdateMinigameDto } from './dto/update-minigame.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Minigame, MinigameLog, MinigameType } from '@/database/schemas';
import { CreateMinigameLogDto } from './dto/create-minigame-log.dto';
import { SuccessResponseDto } from '@/common/dto';
import { CompleteReadingSessionDto } from './dto/complete-reading-session.dto';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
@Controller('minigames')
export class MinigamesController {
  constructor(private readonly minigamesService: MinigamesService) {}
  /*
        GET /minigames/readingmaterials/:readingMaterialID/random
        GET /minigames/:readingSessionID/complete
        GET /minigames/:readingSessionID/random
    */

  @Get('readingmaterials/:readingMaterialID/random')
  @ApiOperation({
    summary: 'Get 3 random minigames for a specific reading material',
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

  @Get(':readingSessionID/random')
  @ApiOperation({
    summary: 'Get 3 random minigames for a specific reading session',
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

  @Post('logs/SentenceRearrangement')
  @ApiOperation({
    summary: 'Create a log for SentenceRearrangement minigame',
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

  @Post('logs/Choices')
  @ApiOperation({
    summary: 'Create a log for Choices minigame',
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

  @Post('logs/WordsFromLetters')
  @ApiOperation({
    summary: 'Create a log for WordsFromLetters minigame',
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
}
