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
exports.CreateReadingMaterialDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateReadingMaterialDto {
}
exports.CreateReadingMaterialDto = CreateReadingMaterialDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Source of the reading material",
        required: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Boolean)
], CreateReadingMaterialDto.prototype, "is_deped", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Title of the reading material",
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReadingMaterialDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Author of the reading material",
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReadingMaterialDto.prototype, "author", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Description of the reading material",
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReadingMaterialDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Grade level for which the reading material is suitable",
        required: true,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateReadingMaterialDto.prototype, "grade_level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Cover link image URL for the reading material",
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReadingMaterialDto.prototype, "cover", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "List of genre for the reading material",
        required: true,
        type: [String],
    }),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsNotEmpty)({ each: true }),
    __metadata("design:type", Array)
], CreateReadingMaterialDto.prototype, "genres", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Content of the reading material",
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReadingMaterialDto.prototype, "content", void 0);
//# sourceMappingURL=create-reading-material.dto.js.map