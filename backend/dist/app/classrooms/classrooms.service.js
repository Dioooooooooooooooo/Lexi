"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassroomsService = void 0;
const common_1 = require("@nestjs/common");
const kysely_1 = require("kysely");
const request_context_1 = require("../../common/utils/request-context");
let ClassroomsService = class ClassroomsService {
    constructor(db) {
        this.db = db;
    }
    async create(createClassroomDto) {
        const req = (0, request_context_1.getCurrentRequest)();
        const user = req['user'];
        const join_code = await this.generateUniqueRoomCode();
        const newClassroom = {
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
    async enroll(enrollPupilDto) {
        const newClassroomEnrollment = enrollPupilDto.pupil_ids.map(p_id => {
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
            const match = err.detail.match(/\(pupil_id, classroom_id\)=\(([^,]+), ([^)]+)\)/);
            if (match) {
                const [_, pupilId] = match;
                throw new common_1.ConflictException(`Pupil ${pupilId} is already enrolled in this classroom`);
            }
            throw err;
        });
    }
    async unenroll(unEnrollPupilDto) {
        return await this.db
            .deleteFrom('public.classroom_enrollment')
            .where('pupil_id', 'in', unEnrollPupilDto.pupil_ids)
            .where('classroom_id', '=', unEnrollPupilDto.classroom_id)
            .returningAll()
            .execute();
    }
    async join(joinClassroomDto) {
        const req = (0, request_context_1.getCurrentRequest)();
        const user = req['user'];
        const classroom = await this.findByCode(joinClassroomDto.code);
        const newClassroomEnrollment = {
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
                throw new common_1.ConflictException('Pupil is already enrolled in this classroom');
            }
            throw err;
        });
    }
    async leave(leaveClassroomDto) {
        const req = (0, request_context_1.getCurrentRequest)();
        const user = req['user'];
        await this.db
            .deleteFrom('public.classroom_enrollment')
            .where('pupil_id', '=', user.pupil.id)
            .where('classroom_id', '=', leaveClassroomDto.classroom_id)
            .returningAll()
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException(`Enrollment for pupil ${user.pupil.id} in classroom ${leaveClassroomDto.classroom_id} not found`));
    }
    async findAll() {
        const req = (0, request_context_1.getCurrentRequest)();
        const user = req['user'];
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
    async findOne(id) {
        const req = (0, request_context_1.getCurrentRequest)();
        const user = req['user'];
        if (user.role === 'Teacher') {
            return await this.db
                .selectFrom('public.classroom_view as cv')
                .where('cv.id', '=', id)
                .where('teacher_id', '=', user.teacher.id)
                .selectAll()
                .executeTakeFirstOrThrow(() => new common_1.NotFoundException(`Classroom with id ${id} not found or not assigned to you as a teacher`));
        }
        return await this.db
            .selectFrom('public.classroom_view as cv')
            .leftJoin('public.classroom_enrollment as ce', 'ce.classroom_id', 'cv.id')
            .where('cv.id', '=', id)
            .where('ce.pupil_id', '=', user.pupil.id)
            .selectAll()
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException(`Classroom with id ${id} not found or you are not enrolled as a pupil`));
    }
    async update(id, updateClassroomDto) {
        const req = (0, request_context_1.getCurrentRequest)();
        const user = req['user'];
        const classroom = await this.db
            .updateTable('public.classroom_view')
            .set(updateClassroomDto)
            .where('id', '=', id)
            .where('teacher_id', '=', user.teacher.id)
            .returningAll()
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException(`Classroom with id ${id} not found or not assigned to you as a teacher`));
        return classroom;
    }
    async remove(id) {
        const req = (0, request_context_1.getCurrentRequest)();
        const user = req['user'];
        const classroom = await this.db
            .deleteFrom('public.classroom_view')
            .where('id', '=', id)
            .where('teacher_id', '=', user.teacher.id)
            .returningAll()
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException(`Classroom with id ${id} not found or not assigned to you as a teacher`));
        return classroom;
    }
    async findByCode(code) {
        return await this.db
            .selectFrom('public.classroom_view')
            .where('join_code', '=', code)
            .selectAll()
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException(`Classroom with code ${code} not found`));
    }
    async generateUniqueRoomCode(length = 6) {
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
};
exports.ClassroomsService = ClassroomsService;
exports.ClassroomsService = ClassroomsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE')),
    __metadata("design:paramtypes", [kysely_1.Kysely])
], ClassroomsService);
//# sourceMappingURL=classrooms.service.js.map