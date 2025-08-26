import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { ClassroomsService } from "./classrooms.service";
import { CreateClassroomDto } from "./dto/create-classroom.dto";
import { UpdateClassroomDto } from "./dto/update-classroom.dto";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../auth/role-guard";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles } from "@/decorators/roles.decorator";
import { SuccessResponseDto } from "@/common/dto";
import { Classroom } from "@/database/schemas";

@Controller("classrooms")
@ApiTags("Classrooms")
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

  @Get()
  @ApiOperation({
    summary: "Find classrooms by teacher id",
  })
  async findAll() {
    const data = await this.classroomsService.findAll();
    return { message: "Classrooms successfully fetched", data };
  }

  @Get(":id")
  @ApiOperation({
    summary: "Find classroom by id",
  })
  async findOne(@Param("id") id: string) {
    const data = await this.classroomsService.findOne(id);
    return { message: "Classroom successfully fetched", data };
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Update classroom by id",
  })
  async update(
    @Param("id") id: string,
    @Body() updateClassroomDto: UpdateClassroomDto,
  ) {
    const data = await this.classroomsService.update(id, updateClassroomDto);
    return { message: "Classroom successfully updated", data };
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete classroom by id",
  })
  async remove(@Param("id") id: string) {
    const data = await this.classroomsService.remove(id);
    return { message: "Classroom successfully deleted", data };
  }
}
