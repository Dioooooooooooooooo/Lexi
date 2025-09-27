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
exports.ClassroomsController = void 0;
const common_1 = require("@nestjs/common");
const classrooms_service_1 = require("./classrooms.service");
const create_classroom_dto_1 = require("./dto/create-classroom.dto");
const update_classroom_dto_1 = require("./dto/update-classroom.dto");
const passport_1 = require("@nestjs/passport");
const role_guard_1 = require("../auth/role-guard");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../../decorators/roles.decorator");
const dto_1 = require("../../common/dto");
const join_classroom_dto_1 = require("./dto/join-classroom.dto");
const leave_classroom_dto_1 = require("./dto/leave-classroom.dto");
const pupil_classroom_dto_1 = require("./dto/pupil-classroom.dto");
let ClassroomsController = class ClassroomsController {
    constructor(classroomsService) {
        this.classroomsService = classroomsService;
    }
    async create(createClassroomDto) {
        const data = await this.classroomsService.create(createClassroomDto);
        return { message: 'Classroom created successfully', data };
    }
    async enroll(enrollPupilDto) {
        const enrolled = await this.classroomsService.enroll(enrollPupilDto);
        return { message: 'Successfully enrolled pupils', data: enrolled };
    }
    async unEnroll(unEnrollPupilDto) {
        const unenrolled = await this.classroomsService.unenroll(unEnrollPupilDto);
        return { message: 'Successfully unenrolled pupils', data: unenrolled };
    }
    async join(joinClassroomDto) {
        await this.classroomsService.join(joinClassroomDto);
        return { message: 'Successfully joined classroom' };
    }
    async leave(leaveClassroomDto) {
        await this.classroomsService.leave(leaveClassroomDto);
        return { message: 'Successfully left classroom' };
    }
    async findAll() {
        const data = await this.classroomsService.findAll();
        return { message: 'Classrooms successfully fetched', data };
    }
    async findOne(id) {
        const data = await this.classroomsService.findOne(id);
        return { message: 'Classroom successfully fetched', data };
    }
    async update(id, updateClassroomDto) {
        const data = await this.classroomsService.update(id, updateClassroomDto);
        return { message: 'Classroom successfully updated', data };
    }
    async remove(id) {
        const data = await this.classroomsService.remove(id);
        return { message: 'Classroom successfully deleted', data };
    }
};
exports.ClassroomsController = ClassroomsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a classroom',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Classroom created successfully',
        type: dto_1.SuccessResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_classroom_dto_1.CreateClassroomDto]),
    __metadata("design:returntype", Promise)
], ClassroomsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('enroll'),
    (0, swagger_1.ApiOperation)({
        summary: 'Enroll pupils',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Pupils enrolled successfully',
        type: dto_1.SuccessResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pupil_classroom_dto_1.EnrollPupilDto]),
    __metadata("design:returntype", Promise)
], ClassroomsController.prototype, "enroll", null);
__decorate([
    (0, common_1.Post)('unenroll'),
    (0, swagger_1.ApiOperation)({
        summary: 'Unenroll pupils',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Pupils unenrolled successfully',
        type: dto_1.SuccessResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pupil_classroom_dto_1.UnEnrollPupilDto]),
    __metadata("design:returntype", Promise)
], ClassroomsController.prototype, "unEnroll", null);
__decorate([
    (0, common_1.Post)('join'),
    (0, roles_decorator_1.Roles)(['Pupil']),
    (0, swagger_1.ApiOperation)({
        summary: 'Join classroom by code',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [join_classroom_dto_1.JoinClassroomDto]),
    __metadata("design:returntype", Promise)
], ClassroomsController.prototype, "join", null);
__decorate([
    (0, common_1.Post)('leave'),
    (0, roles_decorator_1.Roles)(['Pupil']),
    (0, swagger_1.ApiOperation)({
        summary: 'Leave classroom',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Left classroom successfully',
        type: dto_1.SuccessResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [leave_classroom_dto_1.LeaveClassroomDto]),
    __metadata("design:returntype", Promise)
], ClassroomsController.prototype, "leave", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(['Teacher', 'Pupil']),
    (0, swagger_1.ApiOperation)({
        summary: 'Find classrooms',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Classrooms fetched successfully',
        type: dto_1.SuccessResponseDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClassroomsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(['Teacher', 'Pupil']),
    (0, swagger_1.ApiOperation)({
        summary: 'Find classroom by id',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Classroom fetched successfully',
        type: dto_1.SuccessResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClassroomsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update classroom by id',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Classroom updated successfully',
        type: dto_1.SuccessResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_classroom_dto_1.UpdateClassroomDto]),
    __metadata("design:returntype", Promise)
], ClassroomsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete classroom by id',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Classroom deleted successfully',
        type: dto_1.SuccessResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClassroomsController.prototype, "remove", null);
exports.ClassroomsController = ClassroomsController = __decorate([
    (0, common_1.Controller)('classrooms'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), role_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, roles_decorator_1.Roles)(['Teacher']),
    __metadata("design:paramtypes", [classrooms_service_1.ClassroomsService])
], ClassroomsController);
//# sourceMappingURL=classrooms.controller.js.map