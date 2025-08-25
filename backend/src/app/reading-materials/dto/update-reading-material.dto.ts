import { PartialType } from '@nestjs/swagger';
import { CreateReadingMaterialDto } from './create-reading-material.dto';

export class UpdateReadingMaterialDto extends PartialType(CreateReadingMaterialDto) {}
