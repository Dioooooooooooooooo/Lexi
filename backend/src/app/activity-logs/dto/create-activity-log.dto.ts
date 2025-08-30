import { Timestamp } from "@/database/db";
import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class CreateActivityLogDto {
  @ApiProperty({ description: "Minigame log Id", required: true })
  @IsUUID()
  minigame_log_id: string;
}
