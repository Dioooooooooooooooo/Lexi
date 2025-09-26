import { CreateActivityDTO } from './dto/create-activity.dto';
import { SuccessResponseDto } from '@/common/dto';
import { Activity } from '@/database/schemas';
import { ActivityService } from './activity.service';
import { UpdateActivityDTO } from './dto/update-activity.dto';
export declare class ActivityController {
    private readonly activityService;
    constructor(activityService: ActivityService);
    create(classroomId: string, createActivityDTO: CreateActivityDTO): Promise<SuccessResponseDto<Activity>>;
    findOne(classroomId: string, activityId: string): Promise<SuccessResponseDto<Activity>>;
    findAllByClassroomId(classroomId: string): Promise<SuccessResponseDto<Activity[]>>;
    update(classroomId: string, activityId: string, updateActivityDTO: UpdateActivityDTO): Promise<SuccessResponseDto<Activity>>;
    remove(classroomId: string, activityId: string): Promise<SuccessResponseDto<Activity>>;
}
