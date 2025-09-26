import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { Genre } from '@/database/schemas';
import { SuccessResponseDto } from '@/common/dto';
export declare class GenresController {
    private readonly genresService;
    constructor(genresService: GenresService);
    create(createGenreDto: CreateGenreDto): Promise<SuccessResponseDto<Genre>>;
    findAll(): Promise<SuccessResponseDto<Genre[]>>;
}
