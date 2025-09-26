import { Cache } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
export declare class DictionaryService {
    private cacheManager;
    private readonly configService;
    constructor(cacheManager: Cache, configService: ConfigService);
    definition(word: string): Promise<any>;
}
