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

  async uploadImage(file: Express.Multer.File) {
    try {
      const uploaded = await this.imageKit.upload({
        file: file.buffer,
        fileName: file.originalname,
      });

      console.log('Successfully uploaded: ', uploaded);

      return uploaded.url;
    } catch (error) {
      throw new Error('Image upload failed');
    }
  }

  async uploadImageJson(file: {
    uri: string; // original uri from RN picker (optional for reference)
    type: string; // e.g. "image/jpeg"
    name: string; // e.g. "avatar.jpg"
    base64: string; // base64 encoded file contents
  }) {
    try {
      const uploaded = await this.imageKit.upload({
        file: `data:${file.type};base64,${file.base64}`,
        fileName: file.name,
      });

      console.log('Successfully uploaded: ', uploaded);

      return uploaded.url;
    } catch (error) {
      throw new Error('Image upload failed');
    }
  }
}
