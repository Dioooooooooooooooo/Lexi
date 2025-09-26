import { ClassroomsService } from './classrooms.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { SuccessResponseDto } from '@/common/dto';
import { Classroom } from '@/database/schemas';
import { JoinClassroomDto } from './dto/join-classroom.dto';
import { LeaveClassroomDto } from './dto/leave-classroom.dto';
import { EnrollPupilDto, UnEnrollPupilDto } from './dto/pupil-classroom.dto';
export declare class ClassroomsController {
    private readonly classroomsService;
    constructor(classroomsService: ClassroomsService);
    create(createClassroomDto: CreateClassroomDto): Promise<SuccessResponseDto<Classroom>>;
    enroll(enrollPupilDto: EnrollPupilDto): Promise<{
        message: string;
        data: {
            created_at: Date;
            id: string;
            pupil_id: string;
            classroom_id: string;
        }[];
    }>;
    unEnroll(unEnrollPupilDto: UnEnrollPupilDto): Promise<{
        message: string;
        data: {
            created_at: Date;
            id: string;
            pupil_id: string;
            classroom_id: string;
        }[];
    }>;
    join(joinClassroomDto: JoinClassroomDto): Promise<{
        message: string;
    }>;
    leave(leaveClassroomDto: LeaveClassroomDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<{
        message: string;
        data: {
            created_at: Date;
            id: string;
            updated_at: Date;
            description: string;
            join_code: string;
            name: string;
            teacher_id: string;
        }[];
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: {
            created_at: Date;
            id: string;
            updated_at: Date;
            description: string;
            join_code: string;
            name: string;
            teacher_id: string;
        };
    }>;
    update(id: string, updateClassroomDto: UpdateClassroomDto): Promise<{
        message: string;
        data: {
            created_at: Date;
            id: string;
            updated_at: Date;
            description: string;
            join_code: string;
            name: string;
            teacher_id: string;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
        data: {
            created_at: Date;
            id: string;
            updated_at: Date;
            description: string;
            join_code: string;
            name: string;
            teacher_id: string;
        };
    }>;
}
