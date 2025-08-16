import { PartialType } from '@nestjs/swagger';
import { CreateMinigameDto } from './create-minigame.dto';

export class UpdateMinigameDto extends PartialType(CreateMinigameDto) {}
