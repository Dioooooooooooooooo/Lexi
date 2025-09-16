import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImagekitService } from './imagekit.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { SuccessResponseDto } from '@/common/dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('upload')
export class ImagekitController {
  constructor(private readonly imagekitService: ImagekitService) {}

  @Post('image')
  @ApiOperation({ summary: 'Upload image to ImageKit' })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    type: SuccessResponseDto,
  })
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SuccessResponseDto<{ url: string; fileId: string }>> {
    const result = await this.imagekitService.uploadImage(file);
    return {
      message: 'Image uploaded successfully',
      data: result,
    };
  }
}
