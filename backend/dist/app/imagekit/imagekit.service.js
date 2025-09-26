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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagekitService = void 0;
const common_1 = require("@nestjs/common");
const imagekit_1 = __importDefault(require("imagekit"));
let ImagekitService = class ImagekitService {
    constructor() {
        this.imageKit = new imagekit_1.default({
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
        });
    }
    async uploadImage(file) {
        try {
            const uploaded = await this.imageKit.upload({
                file: file.buffer,
                fileName: file.originalname,
            });
            console.log('Successfully uploaded: ', uploaded);
            return uploaded.url;
        }
        catch (error) {
            throw new Error('Image upload failed');
        }
    }
};
exports.ImagekitService = ImagekitService;
exports.ImagekitService = ImagekitService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ImagekitService);
//# sourceMappingURL=imagekit.service.js.map