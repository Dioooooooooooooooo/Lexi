import { PartialType } from '@nestjs/swagger';
import { CreateLibraryEntryDto } from './create-library-entry.dto';

export class UpdateLibraryEntryDto extends PartialType(CreateLibraryEntryDto) {}
