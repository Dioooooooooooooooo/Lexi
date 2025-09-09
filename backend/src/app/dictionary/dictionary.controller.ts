import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SuccessResponseDto } from '@/common/dto';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
@Controller('dictionary')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Get('dictionary/:word')
  @ApiOperation({
    summary: 'Get definition of word',
  })
  async definition(
    @Param('word') word: string,
  ): Promise<SuccessResponseDto<any>> {
    const definition = await this.dictionaryService.definition(word);

    return {
      message: 'Definition successfully fetched',
      data: definition,
    };
  }
}
