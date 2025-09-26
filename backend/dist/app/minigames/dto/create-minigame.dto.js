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
exports.CreateSentenceRearrangementGame = exports.CreateChoicesGame = exports.ChoicesObject = exports.CreateWordsFromLettersGame = exports.CreateMinigameDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateMinigameDto {
}
exports.CreateMinigameDto = CreateMinigameDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reading Material Id',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    __metadata("design:type", String)
], CreateMinigameDto.prototype, "reading_material_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Part number of where the minigame appears in the story.',
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    __metadata("design:type", Number)
], CreateMinigameDto.prototype, "part_num", void 0);
class CreateWordsFromLettersGame extends CreateMinigameDto {
}
exports.CreateWordsFromLettersGame = CreateWordsFromLettersGame;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Part number of where the minigame appears in the story. Always 10 for WordsFromLetters.',
        required: true,
        example: 10,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Equals)(10),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    __metadata("design:type", Number)
], CreateWordsFromLettersGame.prototype, "part_num", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contains the letters needed in creating words.',
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateWordsFromLettersGame.prototype, "letters", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Words that can be created from the letters list.',
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateWordsFromLettersGame.prototype, "words", void 0);
class ChoicesObject {
}
exports.ChoicesObject = ChoicesObject;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Choice text', required: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ChoicesObject.prototype, "choice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether this choice is correct',
        required: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ChoicesObject.prototype, "answer", void 0);
class CreateChoicesGame extends CreateMinigameDto {
}
exports.CreateChoicesGame = CreateChoicesGame;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Question', required: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateChoicesGame.prototype, "question", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of choices.',
        type: [ChoicesObject],
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ChoicesObject),
    __metadata("design:type", Array)
], CreateChoicesGame.prototype, "choices", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Explanation of the answer.', required: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateChoicesGame.prototype, "explanation", void 0);
class CreateSentenceRearrangementGame extends CreateMinigameDto {
}
exports.CreateSentenceRearrangementGame = CreateSentenceRearrangementGame;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of correct answers.', required: true }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateSentenceRearrangementGame.prototype, "correct_answer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sentence parts', required: true }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateSentenceRearrangementGame.prototype, "parts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Explanation of the answer.', required: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSentenceRearrangementGame.prototype, "explanation", void 0);
//# sourceMappingURL=create-minigame.dto.js.map