import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateActivityDTO {
  @ApiProperty({
    description: "Activity Name",
    example: "Cat in the Hat Activity",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  title: string;

  @ApiProperty({
    description: "Description on what the activity is about",
    example:
      "Read the Cat in the Hat book and understand the adventures of our beloved main characters!",
    required: false,
  })
  @IsString()
  @MaxLength(256)
  description: string;

  // sakto ba
  @ApiProperty({ required: true })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  reading_material_id: string;
}
