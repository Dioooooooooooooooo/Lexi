import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateReadingMaterialDto {
  @ApiProperty({
    description: "Source of the reading material",
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  is_deped: boolean;

  @ApiProperty({
    description: "Title of the reading material",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "Author of the reading material",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({
    description: "Description of the reading material",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: "Grade level for which the reading material is suitable",
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  grade_level: number;

  @ApiProperty({
    description: "Cover link image URL for the reading material",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  cover: string;

  @ApiProperty({
    description: "List of genre for the reading material",
    required: true,
    type: [String],
  })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  genres: string[];

  @ApiProperty({
    description: "Content of the reading material",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
