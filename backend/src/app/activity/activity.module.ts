import { Module } from "@nestjs/common";
import { ActivityController } from "./activity.controller";
import { ActivityService } from "./activity.service";
import { ClassroomsModule } from "../classrooms/classrooms.module";

@Module({
  controllers: [ActivityController],
  providers: [ActivityService],
  imports: [ClassroomsModule],
})
export class ActivityModule {}
