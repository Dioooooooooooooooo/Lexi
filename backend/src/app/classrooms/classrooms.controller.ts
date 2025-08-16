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

@Controller("classrooms")
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @ApiBearerAuth("JWT-auth")
  @Roles(["Teacher"])
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
  create(
    @Request() req: any,
    @Body() createClassroomDto: CreateClassroomDto,
  ): Promise<SuccessResponseDto> {
    return this.classroomsService.create(req.user, createClassroomDto);
  }

  @Get()
  findAll() {
    return this.classroomsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.classroomsService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateClassroomDto: UpdateClassroomDto,
  ) {
    return this.classroomsService.update(+id, updateClassroomDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.classroomsService.remove(+id);
  }
}
