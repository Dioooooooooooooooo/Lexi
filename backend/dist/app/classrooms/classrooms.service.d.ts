import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { JoinClassroomDto } from './dto/join-classroom.dto';
import { LeaveClassroomDto } from './dto/leave-classroom.dto';
import { EnrollPupilDto, UnEnrollPupilDto } from './dto/pupil-classroom.dto';
import { Kysely } from 'kysely';
import { DB } from '@/database/db';
import { Classroom } from '@/database/schemas';
export declare class ClassroomsService {
    private readonly db;
    constructor(db: Kysely<DB>);
    create(createClassroomDto: CreateClassroomDto): Promise<Classroom>;
    enroll(enrollPupilDto: EnrollPupilDto): Promise<{
        created_at: Date;
        id: string;
        pupil_id: string;
        classroom_id: string;
    }[]>;
    unenroll(unEnrollPupilDto: UnEnrollPupilDto): Promise<{
        created_at: Date;
        id: string;
        pupil_id: string;
        classroom_id: string;
    }[]>;
    join(joinClassroomDto: JoinClassroomDto): Promise<void>;
    leave(leaveClassroomDto: LeaveClassroomDto): Promise<void>;
    findAll(): Promise<Classroom[]>;
    findOne(id: string): Promise<Classroom>;
    update(id: string, updateClassroomDto: UpdateClassroomDto): Promise<Classroom>;
    remove(id: string): Promise<Classroom>;
    findByCode(code: string): Promise<Classroom>;
    generateUniqueRoomCode(length?: number): Promise<string>;
}
