import { Injectable } from '@nestjs/common';
import ImageKit from 'imagekit';

@Injectable()
export class ImagekitService {
    private imageKit: ImageKit;

    constructor() {
        this.imageKit = new ImageKit({
          publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
          privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
          urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
        });
        
    }

    async uploadImage(file: Express.Multer.File){
        try {
            const uploaded = await this.imageKit.upload({
                file: file.buffer,
                fileName: file.originalname,
            });
            
            return {
                url: uploaded.url,
                fileId: uploaded.fileId,
            };
        } catch (error) {
            throw new Error('Image upload failed');
        }
    }
}
