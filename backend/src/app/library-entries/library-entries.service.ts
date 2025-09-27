import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { getCurrentRequest } from '@/common/utils/request-context';
import { Kysely } from 'kysely';
import { DB } from '@/database/db';

@Injectable()
export class LibraryEntriesService {
  constructor(@Inject('DATABASE') private readonly db: Kysely<DB>) {}

  async create(readingMaterialId: string) {
    const req = getCurrentRequest();
    const user = req['user'];

    const newEntry = await this.db
      .insertInto('public.library_entries')
      .values({
        user_id: user.id,
        reading_material_id: readingMaterialId,
      })
      .returningAll()
      .executeTakeFirstOrThrow(
        () =>
          new NotFoundException('Failed to add reading material to library.'),
      );

    return newEntry;
  }

  async findAll() {
    const req = getCurrentRequest();
    const user = req['user'];

    const readingMaterials = await this.db
      .selectFrom('public.library_entries as le')
      .leftJoin(
        'public.reading_materials as rm',
        'rm.id',
        'le.reading_material_id',
      )
      .where('le.user_id', '=', user.id)
      .orderBy('created_at', 'desc')
      .selectAll('rm')
      .execute();

    return readingMaterials;
  }

  async remove(readingMaterialId: string) {
    const req = getCurrentRequest();
    const user = req['user'];

    await this.db
      .deleteFrom('public.library_entries')
      .where('reading_material_id', '=', readingMaterialId)
      .where('user_id', '=', user.id)
      .executeTakeFirstOrThrow(
        () => new NotFoundException('Library entry not found.'),
      );
  }
}
