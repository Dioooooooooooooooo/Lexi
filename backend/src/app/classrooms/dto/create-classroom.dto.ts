import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateClassroomDto {
  @ApiProperty({
    description: "Classroom Name",
    example: "Section Maya",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  name: string;

  @ApiProperty({
    description: "Classroom Name",
    example: "Section Maya",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description: string;
}
