import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateReadingSessionDto {
  @ApiProperty({
    description: "Reading material id",
    example: "e8425f42-0650-4c5b-8380-d54cf8de481e",
    required: true,
  })
  @IsString()
  reading_material_id: string;
}
