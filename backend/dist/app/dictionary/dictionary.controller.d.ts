import { DictionaryService } from './dictionary.service';
import { SuccessResponseDto } from '@/common/dto';
export declare class DictionaryController {
    private readonly dictionaryService;
    constructor(dictionaryService: DictionaryService);
    definition(word: string): Promise<SuccessResponseDto<any>>;
}
