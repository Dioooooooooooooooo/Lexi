import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  Request,
} from "@nestjs/common";
import { ClassroomsService } from "./classrooms.service";
import { CreateClassroomDto } from "./dto/create-classroom.dto";
import { UpdateClassroomDto } from "./dto/update-classroom.dto";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../auth/role-guard";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Roles } from "@/decorators/roles.decorator";
import { ErrorResponseDto, SuccessResponseDto } from "@/common/dto";
import { Classroom } from "@/database/schemas";

@Controller("classrooms")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@ApiBearerAuth("JWT-auth")
@Roles(["Teacher"])
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  @Post()
  @ApiOperation({
    summary: "Create classroom",
    description: "Create classroom with its name and description",
  })
  @ApiBody({
    type: CreateClassroomDto,
    description: "Create classroom data",
    examples: {
      example1: {
        summary: "Example create classroom",
        description: "A sample create classroom data",
        value: {
          name: "Section Maya",
          description: "Friendly classroom",
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Classroom created successfully",
    type: SuccessResponseDto,
    example: {
      message: "Classroom created successfully",
      data: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "Section Maya",
        description: "Friendly classroom",
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or missing token",
    type: ErrorResponseDto,
    example: {
      statusCode: 401,
      message: "Unauthorized",
      error: "Unauthorized",
    },
  })
  @HttpCode(HttpStatus.OK)
  async create(
    @Request() req: any,
    @Body() createClassroomDto: CreateClassroomDto,
  ): Promise<SuccessResponseDto<Classroom>> {
    const data = await this.classroomsService.create(
      req.user,
      createClassroomDto,
    );

    return { message: "Classroom created successfully", data };
  }

  @Get()
  async findAll() {
    const data = await this.classroomsService.findAll();
    return { message: "Classrooms successfully fetched", data };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const data = await this.classroomsService.findOne(id);
    return { message: "Classroom successfully fetched", data };
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateClassroomDto: UpdateClassroomDto,
  ) {
    const data = await this.classroomsService.update(id, updateClassroomDto);
    return { message: "Classroom successfully updated", data };
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    const data = await this.classroomsService.remove(id);
    return { message: "Classroom successfully deleted", data };
  }
}
