import { Module } from '@nestjs/common';
import { PupilsService } from '../pupils/pupils.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AchievementsService } from '../achievements/achievements.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PupilsService, AchievementsService],
})
export class UserModule {}
