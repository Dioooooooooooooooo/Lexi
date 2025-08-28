import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PupilsService } from '../pupils/pupils.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PupilsService],
})
export class UserModule {}
