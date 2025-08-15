import { ApiProperty } from "@nestjs/swagger";

export class ErrorResponseDto {
  @ApiProperty({ description: "Status of the response", example: "error" })
  status: "error";

  @ApiProperty({ description: "Error message", example: "Invalid credentials" })
  message: string;
}

export class SuccessResponseDto {
  @ApiProperty({
    description: "Success message",
    example: "User created successfully",
  })
  message: string;

  @ApiProperty({
    description: "Returned data payload",
  })
  data?: Record<string, any>;
}
