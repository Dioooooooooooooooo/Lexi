import { IsNumber, Max, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateReadingSessionDto {
  @ApiProperty({
    description: "Completion percentage of the reading session",
    example: 55.5,
    required: true,
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  completion_percentage: number;
}
