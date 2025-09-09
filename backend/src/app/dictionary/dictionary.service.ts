import { Inject, Injectable } from '@nestjs/common';

import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DictionaryService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  async definition(word: string) {
    const cache = await this.cacheManager.get(`dictionary-${word}`);

    if (cache) {
      return cache;
    }

    const response = await fetch(
      `https://www.dictionaryapi.com/api/v3/references/sd2/json/${word}?key=${this.configService.get('DICTIONARY_API_KEY')}`,
    );

    const result = await response.json();

    await this.cacheManager.set(
      `dictionary-${word}`,
      result,
      this.configService.get<number>('DICTIONARY_TTL_DAYS', 120) *
        24 *
        60 *
        60 *
        1000, // 120 days in ms,
    );
    return result;
  }
}
