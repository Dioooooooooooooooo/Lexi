import { Module } from "@nestjs/common";
import { ActivityLogsService } from "./activity-logs.service";
import { ActivityLogsController } from "./activity-logs.controller";
import { ActivityModule } from "../activity/activity.module";

@Module({
  controllers: [ActivityLogsController],
  providers: [ActivityLogsService],
  imports: [ActivityModule],
})
export class ActivityLogsModule {}
