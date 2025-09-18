import { Controller, Get, Query } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Get('questions')
  async generate(@Query('story') story: string) {
    return await this.openaiService.generateChoices(story);
  }

  @Get('/hi/generate')
  async generateChoices() {
    return await this.openaiService.generate();
  }
}
