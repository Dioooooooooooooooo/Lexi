import { Module } from '@nestjs/common';
import { PupilsService } from '../pupils/pupils.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PupilsService],
})
export class UserModule {}
