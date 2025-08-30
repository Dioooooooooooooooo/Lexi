import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateAchievementDto {
  @ApiProperty({
    description: 'Achievement Name',
    example: 'Getting Started',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Achievement Description',
    example: '3 Days Login Streak',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @ApiProperty({
    description: 'Badge URL',
    example:
      'https://drive.google.com/file/d/1xfE7JuYYLcUCDA1feVAIpS44UXnN7D1Q/view',
    required: false,
  })
  @IsString()
  @IsUrl()
  badge?: string;
}
