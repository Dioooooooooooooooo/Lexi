import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { JoinClassroomDto } from './dto/join-classroom.dto';
import { LeaveClassroomDto } from './dto/leave-classroom.dto';
import { JwtAccessTokenPayload } from '@/common/types/jwt.types';
import { EnrollPupilDto, UnEnrollPupilDto } from './dto/pupil-classroom.dto';
import { Kysely } from 'kysely';
import { DB } from '@/database/db';
import {
  Classroom,
  NewClassroom,
  NewClassroomEnrollment,
} from '@/database/schemas';
import { getCurrentRequest } from '@/common/utils/request-context';

@Injectable()
export class ClassroomsService {
  constructor(@Inject('DATABASE') private readonly db: Kysely<DB>) {}

  async create(createClassroomDto: CreateClassroomDto): Promise<Classroom> {
    const req = getCurrentRequest();
    const user: JwtAccessTokenPayload = req['user'];
    const join_code = await this.generateUniqueRoomCode();

    const newClassroom: NewClassroom = {
      ...createClassroomDto,
      teacher_id: user.teacher.id,
      join_code,
    };

    const classroom = await this.db
      .insertInto('public.classroom_view')
      .values(newClassroom)
      .returningAll()
      .executeTakeFirst();

    return classroom;
  }

  async enroll(enrollPupilDto: EnrollPupilDto) {
    const newClassroomEnrollment: NewClassroomEnrollment[] =
      enrollPupilDto.pupil_ids.map(p_id => {
        return {
          pupil_id: p_id,
          classroom_id: enrollPupilDto.classroom_id,
        };
      });

    return await this.db
      .insertInto('public.classroom_enrollment')
      .values(newClassroomEnrollment)
      .returningAll()
      .execute()
      .catch(err => {
        const match = err.detail.match(
          /\(pupil_id, classroom_id\)=\(([^,]+), ([^)]+)\)/,
        );

        if (match) {
          const [_, pupilId] = match;
          throw new ConflictException(
            `Pupil ${pupilId} is already enrolled in this classroom`,
          );
        }
        throw err;
      });
  }

  async unenroll(unEnrollPupilDto: UnEnrollPupilDto) {
    return await this.db
      .deleteFrom('public.classroom_enrollment')
      .where('pupil_id', 'in', unEnrollPupilDto.pupil_ids)
      .where('classroom_id', '=', unEnrollPupilDto.classroom_id)
      .returningAll()
      .execute();
  }

  async join(joinClassroomDto: JoinClassroomDto) {
    const req = getCurrentRequest();
    const user: JwtAccessTokenPayload = req['user'];

    const classroom = await this.findByCode(joinClassroomDto.code);

    const newClassroomEnrollment: NewClassroomEnrollment = {
      pupil_id: user.pupil.id,
      classroom_id: classroom.id,
    };

    await this.db
      .insertInto('public.classroom_enrollment')
      .values(newClassroomEnrollment)
      .returningAll()
      .executeTakeFirstOrThrow()
      .catch(err => {
        if (err.code === '23505') {
          throw new ConflictException(
            'Pupil is already enrolled in this classroom',
          );
        }
        throw err;
      });
  }

  async leave(leaveClassroomDto: LeaveClassroomDto) {
    const req = getCurrentRequest();
    const user: JwtAccessTokenPayload = req['user'];

    await this.db
      .deleteFrom('public.classroom_enrollment')
      .where('pupil_id', '=', user.pupil.id)
      .where('classroom_id', '=', leaveClassroomDto.classroom_id)
      .returningAll()
      .executeTakeFirstOrThrow(
        () =>
          new NotFoundException(
            `Enrollment for pupil ${user.pupil.id} in classroom ${leaveClassroomDto.classroom_id} not found`,
          ),
      );
  }

  async findAll(): Promise<Classroom[]> {
    const req = getCurrentRequest();
    const user: JwtAccessTokenPayload = req['user'];

    const role = user.role;
    if (role === 'Teacher') {
      return await this.db
        .selectFrom('public.classroom_view')
        .where('teacher_id', '=', user.teacher.id)
        .selectAll()
        .execute();
    }

    return await this.db
      .selectFrom('public.classroom_view as cv')
      .leftJoin('public.classroom_enrollment as ce', 'ce.classroom_id', 'cv.id')
      .where('ce.pupil_id', '=', user.pupil.id)
      .selectAll()
      .execute();
  }

  async findOne(id: string): Promise<Classroom> {
    const req = getCurrentRequest();
    const user: JwtAccessTokenPayload = req['user'];

    if (user.role === 'Teacher') {
      return await this.db
        .selectFrom('public.classroom_view as cv')
        .where('cv.id', '=', id)
        .where('teacher_id', '=', user.teacher.id)
        .selectAll()
        .executeTakeFirstOrThrow(
          () =>
            new NotFoundException(
              `Classroom with id ${id} not found or not assigned to you as a teacher`,
            ),
        );
    }

    return await this.db
      .selectFrom('public.classroom_view as cv')
      .leftJoin('public.classroom_enrollment as ce', 'ce.classroom_id', 'cv.id')
      .where('cv.id', '=', id)
      .where('ce.pupil_id', '=', user.pupil.id)
      .selectAll()
      .executeTakeFirstOrThrow(
        () =>
          new NotFoundException(
            `Classroom with id ${id} not found or you are not enrolled as a pupil`,
          ),
      );
  }

  async update(
    id: string,
    updateClassroomDto: UpdateClassroomDto,
  ): Promise<Classroom> {
    const req = getCurrentRequest();
    const user: JwtAccessTokenPayload = req['user'];

    const classroom = await this.db
      .updateTable('public.classroom_view')
      .set(updateClassroomDto)
      .where('id', '=', id)
      .where('teacher_id', '=', user.teacher.id)
      .returningAll()
      .executeTakeFirstOrThrow(
        () =>
          new NotFoundException(
            `Classroom with id ${id} not found or not assigned to you as a teacher`,
          ),
      );

    return classroom;
  }

  async remove(id: string): Promise<Classroom> {
    const req = getCurrentRequest();
    const user: JwtAccessTokenPayload = req['user'];

    const classroom = await this.db
      .deleteFrom('public.classroom_view')
      .where('id', '=', id)
      .where('teacher_id', '=', user.teacher.id)
      .returningAll()
      .executeTakeFirstOrThrow(
        () =>
          new NotFoundException(
            `Classroom with id ${id} not found or not assigned to you as a teacher`,
          ),
      );

    return classroom;
  }

  async findByCode(code: string): Promise<Classroom> {
    return await this.db
      .selectFrom('public.classroom_view')
      .where('join_code', '=', code)
      .selectAll()
      .executeTakeFirstOrThrow(
        () => new NotFoundException(`Classroom with code ${code} not found`),
      );
  }

  async generateUniqueRoomCode(length = 6): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    while (true) {
      let code = '';
      for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const existing = await this.db
        .selectFrom('public.classrooms')
        .select('join_code')
        .where('join_code', '=', code)
        .executeTakeFirst();

      if (!existing) {
        return code;
      }
    }
  }
}
