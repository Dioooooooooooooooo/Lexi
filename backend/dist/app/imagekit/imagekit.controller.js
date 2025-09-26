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
exports.ImagekitController = void 0;
const common_1 = require("@nestjs/common");
const imagekit_service_1 = require("./imagekit.service");
const platform_express_1 = require("@nestjs/platform-express");
const dto_1 = require("../../common/dto");
const swagger_1 = require("@nestjs/swagger");
let ImagekitController = class ImagekitController {
    constructor(imagekitService) {
        this.imagekitService = imagekitService;
    }
    async uploadImage(file) {
        const result = await this.imagekitService.uploadImage(file);
        return {
            message: 'Image uploaded successfully',
            data: result,
        };
    }
};
exports.ImagekitController = ImagekitController;
__decorate([
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.Post)('image'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload image to ImageKit' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Image uploaded successfully',
        type: dto_1.SuccessResponseDto,
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ImagekitController.prototype, "uploadImage", null);
exports.ImagekitController = ImagekitController = __decorate([
    (0, common_1.Controller)('upload'),
    __metadata("design:paramtypes", [imagekit_service_1.ImagekitService])
], ImagekitController);
//# sourceMappingURL=imagekit.controller.js.map