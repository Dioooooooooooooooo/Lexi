import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class JoinClassroomDto {
  @ApiProperty({
    description: "Classroom Code",
    example: "YOIT1A",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  code: string;
}
