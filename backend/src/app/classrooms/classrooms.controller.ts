import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from "@nestjs/common";
import { ClassroomsService } from "./classrooms.service";
import { CreateClassroomDto } from "./dto/create-classroom.dto";
import { UpdateClassroomDto } from "./dto/update-classroom.dto";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../auth/role-guard";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { Roles } from "@/decorators/roles.decorator";
import { SuccessResponseDto } from "@/common/dto";
import { Classroom } from "@/database/schemas";
import { JoinClassroomDto } from "./dto/join-classroom.dto";
import { LeaveClassroomDto } from "./dto/leave-classroom.dto";
import { EnrollPupilDto, UnEnrollPupilDto } from "./dto/pupil-classroom.dto";

@Controller("classrooms")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@ApiBearerAuth("JWT-auth")
@Roles(["Teacher"])
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  @Post()
  @ApiOperation({
    summary: "Create a classroom",
  })
  async create(
    @Body() createClassroomDto: CreateClassroomDto,
  ): Promise<SuccessResponseDto<Classroom>> {
    const data = await this.classroomsService.create(createClassroomDto);

    return { message: "Classroom created successfully", data };
  }

  @Post("enroll")
  @ApiOperation({
    summary: "Enroll pupils",
  })
  async enroll(@Body() enrollPupilDto: EnrollPupilDto) {
    const enrolled = await this.classroomsService.enroll(enrollPupilDto);
    return { message: "Successfully enrolled pupils", data: enrolled };
  }

  @Post("unenroll")
  @ApiOperation({
    summary: "Unenroll pupils",
  })
  async unEnroll(@Body() unEnrollPupilDto: UnEnrollPupilDto) {
    const unenrolled = await this.classroomsService.unenroll(unEnrollPupilDto);
    return { message: "Successfully unenrolled pupils", data: unenrolled };
  }

  @Post("join")
  @Roles(["Pupil"])
  @ApiOperation({
    summary: "Join classroom by code",
  })
  async join(@Body() joinClassroomDto: JoinClassroomDto) {
    await this.classroomsService.join(joinClassroomDto);
    return { message: "Successfully joined classroom" };
  }

  @Post("leave")
  @Roles(["Pupil"])
  @ApiOperation({
    summary: "Leave classroom",
  })
  async leave(@Body() leaveClassroomDto: LeaveClassroomDto) {
    await this.classroomsService.leave(leaveClassroomDto);
    return { message: "Successfully left classroom" };
  }

  @Get()
  @Roles(["Teacher", "Pupil"])
  @ApiOperation({
    summary: "Find classrooms",
  })
  async findAll() {
    const data = await this.classroomsService.findAll();
    return { message: "Classrooms successfully fetched", data };
  }

  @Get(":id")
  @Roles(["Teacher", "Pupil"])
  @ApiOperation({
    summary: "Find classroom by id",
  })
  async findOne(@Param("id", new ParseUUIDPipe({ version: "4" })) id: string) {
    const data = await this.classroomsService.findOne(id);
    return { message: "Classroom successfully fetched", data };
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Update classroom by id",
  })
  async update(
    @Param("id", new ParseUUIDPipe({ version: "4" })) id: string,
    @Body() updateClassroomDto: UpdateClassroomDto,
  ) {
    const data = await this.classroomsService.update(id, updateClassroomDto);
    return { message: "Classroom successfully updated", data };
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete classroom by id",
  })
  async remove(@Param("id", new ParseUUIDPipe({ version: "4" })) id: string) {
    const data = await this.classroomsService.remove(id);
    return { message: "Classroom successfully deleted", data };
  }
}
