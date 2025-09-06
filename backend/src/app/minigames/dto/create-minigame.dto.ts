import { ApiProperty } from '@nestjs/swagger';
import {
  Equals,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';

export class CreateMinigameDto {
  @ApiProperty({
    description: 'Reading Material Id',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Exclude({ toPlainOnly: true })
  reading_material_id: string;

  @ApiProperty({
    description: 'Part number of where the minigame appears in the story.',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Exclude({ toPlainOnly: true })
  part_num: number;
}

export class CreateWordsFromLettersGame extends CreateMinigameDto {
  @ApiProperty({
    description:
      'Part number of where the minigame appears in the story. Always 10 for WordsFromLetters.',
    required: true,
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  @Equals(10)
  @Exclude({ toPlainOnly: true })
  part_num: number;

  @ApiProperty({
    description: 'Contains the letters needed in creating words.',
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  letters: string[];

  @ApiProperty({
    description: 'Words that can be created from the letters list.',
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  words: string[];
}

export class ChoicesObject {
  @ApiProperty({ description: 'Choice text', required: true })
  @IsString()
  @IsNotEmpty()
  choice: string;

  @ApiProperty({
    description: 'Whether this choice is correct',
    required: true,
  })
  @IsBoolean()
  answer: boolean;
}

export class CreateChoicesGame extends CreateMinigameDto {
  @ApiProperty({ description: 'Question', required: true })
  @IsNotEmpty()
  @IsString()
  question: string;

  @ApiProperty({
    description: 'List of choices.',
    type: [ChoicesObject],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChoicesObject)
  choices: ChoicesObject[];

  @ApiProperty({ description: 'Explanation of the answer.', required: true })
  @IsString()
  @IsNotEmpty()
  explanation: string;
}

export class CreateSentenceRearrangementGame extends CreateMinigameDto {
  @ApiProperty({ description: 'List of correct answers.', required: true })
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  correct_answer: string[];

  @ApiProperty({ description: 'Sentence parts', required: true })
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  parts: string[];

  @ApiProperty({ description: 'Explanation of the answer.', required: true })
  @IsString()
  @IsNotEmpty()
  explanation: string;
}
