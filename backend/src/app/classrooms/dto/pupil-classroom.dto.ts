import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ClassroomDto {
  @ApiProperty({
    description: 'Classroom Id',
    example: 'eb365c92-6366-4c92-bb8b-f3160187be69',
    required: true,
  })
  @IsUUID()
  classroom_id: string;
}

export class PupilClassroomDto extends ClassroomDto {
  @ApiProperty({
    description: 'Pupil Id',
    example: 'a1b40682-1204-48b4-9b5e-309b29ff640a',
    required: true,
  })
  @IsUUID()
  pupil_id: string;
}

export class BatchPupilClassroomDto extends ClassroomDto {
  @ApiProperty({
    description: 'Array of Pupil Ids',
    example: [
      'a1b40682-1204-48b4-9b5e-309b29ff640a',
      'ad8e218c-c1cf-4718-b99d-72af5fafffb9',
    ],
    required: true,
    type: [String],
  })
  @IsUUID('4', { each: true })
  pupil_ids: string[];
}

export class EnrollPupilDto extends BatchPupilClassroomDto {}
export class UnEnrollPupilDto extends BatchPupilClassroomDto {}
