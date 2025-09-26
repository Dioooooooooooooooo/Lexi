import { ReadingMaterialsService } from './reading-materials.service';
import { CreateReadingMaterialDto } from './dto/create-reading-material.dto';
import { SuccessResponseDto } from '@/common/dto';
import { ReadingMaterial } from '@/database/schemas';
import { UserResponseDto } from '../auth/dto/auth.dto';
import { PupilsService } from '../pupils/pupils.service';
export type ReadingMaterialWithGenres = ReadingMaterial & {
    genres: string[];
};
export declare class ReadingMaterialsController {
    private readonly readingMaterialsService;
    private readonly pupilService;
    constructor(readingMaterialsService: ReadingMaterialsService, pupilService: PupilsService);
    create(createReadingMaterialDto: CreateReadingMaterialDto): Promise<SuccessResponseDto<ReadingMaterial>>;
    findAll(): Promise<SuccessResponseDto<ReadingMaterialWithGenres[]>>;
    findRecommendations(req: {
        user: UserResponseDto;
    }): Promise<SuccessResponseDto<ReadingMaterialWithGenres[]>>;
    findOne(id: string): Promise<SuccessResponseDto<ReadingMaterialWithGenres>>;
}
