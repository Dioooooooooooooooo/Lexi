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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnEnrollPupilDto = exports.EnrollPupilDto = exports.BatchPupilClassroomDto = exports.PupilClassroomDto = exports.ClassroomDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ClassroomDto {
}
exports.ClassroomDto = ClassroomDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Classroom Id',
        example: 'eb365c92-6366-4c92-bb8b-f3160187be69',
        required: true,
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ClassroomDto.prototype, "classroom_id", void 0);
class PupilClassroomDto extends ClassroomDto {
}
exports.PupilClassroomDto = PupilClassroomDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pupil Id',
        example: 'a1b40682-1204-48b4-9b5e-309b29ff640a',
        required: true,
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PupilClassroomDto.prototype, "pupil_id", void 0);
class BatchPupilClassroomDto extends ClassroomDto {
}
exports.BatchPupilClassroomDto = BatchPupilClassroomDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of Pupil Ids',
        example: [
            'a1b40682-1204-48b4-9b5e-309b29ff640a',
            'ad8e218c-c1cf-4718-b99d-72af5fafffb9',
        ],
        required: true,
        type: [String],
    }),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], BatchPupilClassroomDto.prototype, "pupil_ids", void 0);
class EnrollPupilDto extends BatchPupilClassroomDto {
}
exports.EnrollPupilDto = EnrollPupilDto;
class UnEnrollPupilDto extends BatchPupilClassroomDto {
}
exports.UnEnrollPupilDto = UnEnrollPupilDto;
//# sourceMappingURL=pupil-classroom.dto.js.map