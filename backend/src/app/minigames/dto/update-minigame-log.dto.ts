import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateMinigameLogDto {
  @ApiProperty({
    description: 'Minigame ID',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  minigame_id: string;

  @ApiProperty({
    description: 'Pupil ID',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  pupil_id: string;

  @ApiProperty({
    description: 'Reading Session ID',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  reading_session_id: string;

  @ApiProperty({
    description: 'Minigame Result in JSON format',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  result: string; // JSON stringified result
}

