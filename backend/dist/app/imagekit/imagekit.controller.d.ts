import { ImagekitService } from './imagekit.service';
import { SuccessResponseDto } from '@/common/dto';
export declare class ImagekitController {
    private readonly imagekitService;
    constructor(imagekitService: ImagekitService);
    uploadImage(file: Express.Multer.File): Promise<SuccessResponseDto<string>>;
}
