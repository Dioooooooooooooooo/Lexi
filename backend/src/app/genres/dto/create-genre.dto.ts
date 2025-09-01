import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateGenreDto {
  @ApiProperty({
    description: "Name of the genre",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
