import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class LeaveClassroomDto {
  @ApiProperty({
    description: 'Classroom Id',
    example: 'b2dbdc0f-ac02-4404-b1a9-d36a4c7c1078',
    required: true,
  })
  @IsUUID()
  classroom_id: string;
}
