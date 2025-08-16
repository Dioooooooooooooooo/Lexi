import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsPositive } from "class-validator";

export class UpdatePupilProfileDto {
  @ApiProperty({
    description: "Age",
    example: 10,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  age?: number;

  @ApiProperty({
    description: "Grade Level",
    example: 6,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  grade_level: number;
}
